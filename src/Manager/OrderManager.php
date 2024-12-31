<?php

namespace App\Manager;

use App\Entity\Customer\Customer;
use App\Entity\Order\Order;
use App\Entity\Order\OrderStatus;
use App\Entity\Order\Cart;
use App\Entity\Order\EventRow;
use App\Entity\Order\ProductRow;
use App\Entity\Subscription\SubscriptionUsage;
use App\Kernel;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Environment;

class OrderManager extends AbstractManager
{
    public const SERVICE_NAME = 'order';

    protected $twig;

    private const REFERENCES_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private const REFERENCES_LENGTH = 10;


    public function __construct(Kernel $kl, ManagerFactory $mf, ServiceFactory $sf, EntityManagerInterface $em, RequestStack $rs, Environment $twig)
    {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->twig = $twig;
    }

    public function createNewOrder(Customer $customer, OrderStatus $status, Cart $cart): ?Order
    {
        $order = new Order();
        $order->setStatus($status);
        $order->setCustomer($customer);
        $order->setCart($cart);
        $order->setReference($this->generateReference());
        $order->setOrderData($this->getOrderData($order));

        $this->addSubscriptions($order);

        $this->em->persist($order);

        $eventRows = $this->em->getRepository(EventRow::class)->findBy(['cart' => $cart]);
        $productRows = $this->em->getRepository(ProductRow::class)->findBy(['cart' => $cart]);

        $ticketingGroupedEvents = [];

        // Group events by their ticketing class
        foreach ($eventRows as $row) {
            $event = $row->getEvent();
            $ticketing = $event->getTicketing();

            if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
                continue;
            }

            // Get the ticketing class
            $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
            $className = get_class($class);  // use name to be able to store as key

            // Add event to the ticketing class group
            if (!isset($ticketingGroupedEvents[$className])) {
                $ticketingGroupedEvents[$className] = [];
            }
            $ticketingGroupedEvents[$className][] = $row;
        }

        //Group products by their ticketing class
        foreach ($productRows as $row) {
            $product = $row->getProduct();
            $ticketing = $product->getTicketing();

            if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
                continue;
            }

            $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
            $className = get_class($class);  // use name to be able to store as key

            // Add product to the ticketing class group
            if (!isset($ticketingGroupedEvents[$className])) {
                $ticketingGroupedEvents[$className] = [];
            }
            $ticketingGroupedEvents[$className][] = $row;
        }

        // Call createNewOrder once per ticketing class
        foreach ($ticketingGroupedEvents as $className => $events) {
            $ticketing = $events[0]->getEvent()->getTicketing();
            $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());

            if (method_exists($class, 'createNewOrder')) {
                if (! $class->createNewOrder($events, $cart, $order)) {
                    return null;
                }
            }
        }

        return $order;
    }

    public function getOrderData(Order $order)
    {
        $orderData = [];

        $customer = $order->getCustomer();
        $orderData['customer'] = [
            'id'        => $customer->getId(),
            'email'     => $customer->getEmail(),
            'phone'     => $customer->getPhone(),
            'firstName' => $customer->getFirstName(),
            'lastName'  => $customer->getLastName(),
            'civility'  => $customer->getCivility(),
        ];

        $cart = $order->getCart();
        $orderData['cart'] = [
            'id'            => $cart->getId(),
            'total'         => $cart->getTotal(),
            'deliveryPrice' => $cart->getDeliveryPrice(),
            "discount"      => $this->mf->get("cart")->calculateDiscount($cart)
        ];

        $orderData['cart']['eventRows'] = $this->getEventRows($cart);
        $orderData['cart']['productRows'] = $this->getProductRows($cart);
        $orderData['cart']['subscriptionRows'] = $this->getSubscriptionRows($cart);

        $address = $cart->getAddress();
        if (null !== $address) {
            $orderData['cart']['address'] = [
                'id'        => $address->getId(),
                'firstName' => $address->getFirstName(),
                'lastName'  => $address->getLastName(),
                'phone'     => $address->getPhone(),
                'address1'  => $address->getAddress1(),
                'address2'  => $address->getAddress2(),
                'zipcode'   => $address->getZipcode(),
                'city'      => $address->getCity(),
                'country'   => $address->getCountry(),
            ];
        }

        $deliveryMode = $cart->getDeliveryMode();
        if (null !== $deliveryMode) {
            $orderData['cart']['deliveryMode'] = [
                'name'          => $deliveryMode->getName(),
                'manager'       => $deliveryMode->getManager(),
                'description'   => $deliveryMode->getDescription(),
                'module'        => [
                    'id'    => $deliveryMode->getModule()->getId(),
                    'name'  => $deliveryMode->getModule()->getName(),
                ]
            ];
        }

        $orderData['voucher'] = [];
        foreach ($cart->getVouchers() as $voucher) {
            $orderData['voucher'][] = [
                'id'        => $voucher->getId(),
                'name'      => $voucher->getName(),
                'code'      => $voucher->getCode(),
                'discount'  => $voucher->getDiscount(),
                'unit'      => $voucher->getUnit(),
            ];
        }

        return $orderData;
    }

    private function getEventRows(Cart $cart): array
    {
        $eventRows = [];

        foreach ($cart->getEventRows() as $eventRow) {
            $newEventRow = [
                'id' => $eventRow->getId(),
                'total' => $eventRow->getTotal(),
            ];

            $event = $eventRow->getEvent();
            $newEventRow['event'] = [
                'id'                  => $event->getId(),
                'name'                => $event->getName(),
                'slug'                => $event->getSlug(),
                'chapo'               => $event->getChapo(),
                'description'         => $event->getDescription(),
                'eventLength'         => $event->getEventLength(),
                'ticketingReference'  => $event->getTicketingReference(),
                'ticketing'           => null !== $event->getTicketing() ? [
                    'id'      => $event->getTicketing()->getId(),
                    'name'    => $event->getTicketing()->getName(),
                    'type'    => $event->getTicketing()->getType(),
                    'module'  => null !== $event->getTicketing()->getModule() ? [
                        'id'    => $event->getTicketing()->getModule()->getId(),
                        'name'  => $event->getTicketing()->getModule()->getName(),
                    ] : null
                ] : null
            ];

            $newEventRow['eventDate'] = [
                'eventDate'     => $eventRow->getEventDate()->getEventDate()->format('Y-m-d H:i'),
                'state'         => $eventRow->getEventDate()->getState(),
                'reportDate'    => $eventRow->getEventDate()->getReportDate(),
            ];

            $newEventRow['seatingPlan'] = null !== $eventRow->getSeatingPlan() ? [
                'name' => $eventRow->getSeatingPlan()->getName(),
            ] : null;

            $newEventRow['eventSeats'] = [];
            foreach ($eventRow->getEventSeats() as $eventSeat) {
                $newEventRow['eventSeats'][] = [
                    'id'            => $eventSeat->getId(),
                    'name'          => $eventSeat->getName(),
                    'eventPrice'    => [
                        'name'          => $eventSeat->getEventPrice()->getName(),
                        'price'         => $eventSeat->getEventPrice()->getPrice(),
                        'annotation'    => $eventSeat->getEventPrice()->getAnnotation(),
                    ]
                ];
            }

            $eventSeatsGrouped = $this->mf->get('cart')->getEventSeatsGrouped($eventRow);
            $newEventRow['eventSeatsGrouped'] = [];
            foreach ($eventSeatsGrouped as $eventSeatGrouped) {
                $newEventRow['eventSeatsGrouped'][] = [
                    'eventPrice'    => [
                        'name'          => $eventSeatGrouped['eventPrice']->getName(),
                        'price'         => $eventSeatGrouped['eventPrice']->getPrice(),
                        'annotation'    => $eventSeatGrouped['eventPrice']->getAnnotation(),
                    ],
                    'quantity'      => $eventSeatGrouped['quantity'],
                    'total'         => $eventSeatGrouped['total']
                ];
            }

            $newEventRow['voucher'] = [];
            foreach ($eventRow->getVouchers() as $voucher) {
                $newEventRow['voucher'][] = [
                    'id'        => $voucher->getId(),
                    'name'      => $voucher->getName(),
                    'code'      => $voucher->getCode(),
                    'discount'  => $voucher->getDiscount(),
                    'unit'      => $voucher->getUnit(),
                ];
            }

            $eventRows[] = $newEventRow;
        }

        return $eventRows;
    }

    private function getProductRows(Cart $cart): array
    {
        $productRows = [];

        foreach ($cart->getProductRows() as $productRow) {
            $newProductRow = [
                'id'        => $productRow->getId(),
                'quantity'  => $productRow->getQuantity(),
                'total'     => $productRow->getTotal(),
            ];

            $product = $productRow->getProduct();
            $newProductRow['product'] = [
                'id'                    => $product->getId(),
                'name'                  => $product->getName(),
                'price'                 => $product->getPrice(),
                'slug'                  => $product->getSlug(),
                'chapo'                 => $product->getChapo(),
                'description'           => $product->getDescription(),
                'ticketingReference'    => $product->getTicketingReference(),
                'ticketing'             => null !== $product->getTicketing() ? [
                    'id'        => $product->getTicketing()->getId(),
                    'name'      => $product->getTicketing()->getName(),
                    'type'      => $product->getTicketing()->getType(),
                    'module'    => null !== $product->getTicketing()->getModule() ? [
                        'id'        => $product->getTicketing()->getModule()->getId(),
                        'name'      => $product->getTicketing()->getModule()->getName(),
                    ] : null
                ] : null
            ];

            $productRows[] = $newProductRow;
        }

        return $productRows;
    }

    private function getSubscriptionRows(Cart $cart): array
    {
        $subscriptionRows = [];

        foreach ($cart->getSubscriptionRows() as $subscriptionRow) {
            $newSubscriptionRow = [
                'id'       => $subscriptionRow->getId(),
                'quantity' => $subscriptionRow->getQuantity(),
                'total'    => $subscriptionRow->getTotal(),
            ];

            $subscription = $subscriptionRow->getSubscription();
            $newSubscriptionRow['subscription'] = [
                'id'                    => $subscription->getId(),
                'name'                  => $subscription->getName(),
                'price'                 => $subscription->getPrice(),
                'description'           => $subscription->getDescription(),
                'eventNb'               => $subscription->getEventNb(),
                'beginDate'             => null !== $subscription->getBeginDate() ? $subscription->getBeginDate()->format('Y-m-d') : "",
                'endDate'               => null !== $subscription->getEndDate() ? $subscription->getEndDate()->format('Y-m-d') : "",
                'duration'              => $subscription->getDuration(),
                'events'                => [],
            ];

            foreach ($subscription->getEvents() as $event) {
                $newSubscriptionRow['subscription']["events"][] = [
                    'id'        => $event->getId(),
                    'name'      => $event->getName(),
                ];
            }

            $subscriptionRows[] = $newSubscriptionRow;
        }

        return $subscriptionRows;
    }

    private function generateReference(): string
    {
        $chars = self::REFERENCES_CHARS;
        $length = strlen($chars);
        $reference = '';

        for ($i = 0; $i < self::REFERENCES_LENGTH; $i++) {
            $random_character = $chars[mt_rand(0, $length - 1)];
            $reference .= $random_character;
        }

        return $reference;
    }

    public function getOrderForWebsite(int $orderId, int $customerId): ?Order
    {
        return $this->em->getRepository(Order::class)->findOneForWebsite($orderId, $customerId);
    }

    public function getInvoiceFile(Order $order)
    {
        // Get the rendered HTML using specified parameters.
        $html = $this->twig->render($this->mf->get('theme')->getWebsiteTemplatesPath() . "Order/invoice.html.twig", [
            'order' => $order,
            'orderData' => $order->getOrderData(),
            'customer' => $order->getCustomer(),
            'status' => $order->getStatus(),
            'generalData' => [
                "websiteName"       => $this->mf->get('parameter')->getCoreParameter('website_name'),
                "websiteHost"       => $this->mf->get('parameter')->getCoreParameter('website_host'),
                "companyAddress"    => $this->mf->get('parameter')->getCoreParameter('company_address'),
                "companyZipcode"    => $this->mf->get('parameter')->getCoreParameter('company_zipcode'),
                "companyCity"       => $this->mf->get('parameter')->getCoreParameter('company_city'),
                "companyCountry"    => $this->mf->get('parameter')->getCoreParameter('company_country'),
                "companyEmail"      => $this->mf->get('parameter')->getCoreParameter('company_email'),
                "companyPhone"      => $this->mf->get('parameter')->getCoreParameter('company_phone'),
            ]
        ]);

        // Return the HTML as a PDF file in string format.
        return $this->sf->get('pdf')->generatePDFFromHTML($html);
    }

    public function getOrdersSpreadsheet()
    {
        // Create array with label and function to get Value
        $columnName = "A";
        $columnFunctions = [
            "ID"                => fn ($order) => $order->getId(),
            "Référence"         => fn ($order) => $order->getReference(),
            "Status"            => fn ($order) => $order->getStatus()->getName(),
            "Email"             => fn ($order) => $order->getCustomer()->getEmail(),
            "Prénom"            => fn ($order) => $order->getCustomer()->getFirstName() ?? "",
            "Nom"               => fn ($order) => $order->getCustomer()->getLastName() ?? "",
            "Téléphone"         => fn ($order) => $order->getCustomer()->getPhone() ?? "",
            "Addresse 1"        => fn ($order) => $order->getOrderData()['cart']['address']['address1'],
            "Adresse 2"         => fn ($order) => $order->getOrderData()['cart']['address']['address2'] ?? "",
            "Code postal"       => fn ($order) => $order->getOrderData()['cart']['address']['zipcode'],
            "Ville"             => fn ($order) => $order->getOrderData()['cart']['address']['city'],
            "Pays"              => fn ($order) => $order->getOrderData()['cart']['address']['country'],
            "Événements"        => fn ($order) => $this->generateEventsSpreadsheetData($order),
            "Produits"          => fn ($order) => $this->generateProductsSpreadsheetData($order),
            "Prix de livraison" => fn ($order) => ($order->getOrderData()['cart']['deliveryPrice'] ?? "0") . "€",
            "Réduction"         => fn ($order) => ($order->getOrderData()['cart']['discount'] ?? "0") . "€",
            "Total"             => fn ($order) => $order->getOrderData()['cart']['total'] . "€",
        ];

        // Create a new Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Add header labels to spreadsheet
        $labels = array_keys($columnFunctions);
        foreach ($labels as $label) {
            $sheet->getColumnDimension($columnName)->setAutoSize(true);
            $sheet->setCellValue($columnName++ . "1", $label);
        }

        // Get all orders
        $orders = $this->em->getRepository(Order::class)->findAll();

        // Add orders data to spreadsheet
        $row = 2;
        foreach ($orders as $order) {
            $columnName = "A";

            foreach ($columnFunctions as $columnFunction) {
                $sheet->getStyle($columnName . $row)->getAlignment()->setWrapText(true);
                $sheet->getStyle($columnName . $row)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

                $sheet->setCellValue($columnName++ . $row, $columnFunction($order));
            }

            $row++;
        }

        // Get Table Range
        $endColumn = $columnName = chr(ord('A') + count($columnFunctions) - 1);
        $dataRange = "A1:" . $endColumn . ($row - 1);

        // Apply Data Range for AutoFilter
        $sheet->setAutoFilter($dataRange);

        // Create style for header
        $headerStyle = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFCCCCCC'],
            ],
            'font' => [
                'bold' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        // Apply style for header
        $sheet->getStyle("A1:" . $endColumn . "1")->applyFromArray($headerStyle);

        return $spreadsheet;
    }

    private function generateEventsSpreadsheetData(Order $order): string
    {
        $orderData = $order->getOrderData();

        $result = "";
        foreach ($orderData['cart']['eventRows'] as $eventRow) {
            $line = "(" . $eventRow['event']['name'] . ") le " . date("d-m-Y à H:i", strtotime($eventRow['eventDate']['eventDate'])) . "\n";

            foreach ($eventRow['eventSeatsGrouped'] as $eventSeatGrouped) {
                $line .= "- " . $eventSeatGrouped['quantity'] . "x " . $eventSeatGrouped['eventPrice']['name'] . " à " . $eventSeatGrouped['eventPrice']['price'] . "€\n";
            }

            $result .= $line . "\n";
        }

        return $result;
    }

    private function generateProductsSpreadsheetData(Order $order): string
    {
        $orderData = $order->getOrderData();

        $result = "";
        foreach ($orderData['cart']['productRows'] as $productRow) {
            $line = $productRow['quantity'] . "x (" . $productRow['product']['name'] . ") à " . $productRow['product']['price'] . "€\n";

            $result .= $line . "\n";
        }

        return $result;
    }

    private function addSubscriptions(Order $order): void
    {
        $subscriptions = $this->mf->get('subscription')->findSubscriptionForCart($order->getCart());
        if (empty($subscriptions)) {
            return;
        }

        foreach ($subscriptions['subscriptionDiscounts'] as $subscription) {
            foreach ($subscription['eventSeats'] as $eventSeat) {
                $newSubscriptionUsage = new SubscriptionUsage();
                $newSubscriptionUsage->setSubscriptionRow($eventSeat['subscriptionRow']);
                $newSubscriptionUsage->setEventSeat($eventSeat['eventSeat']);
                $newSubscriptionUsage->setEvent($subscription['event']);

                $order->addSubscriptionUsage($newSubscriptionUsage);

                $this->em->persist($newSubscriptionUsage);
            }
        }
    }
}
