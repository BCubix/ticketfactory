import { copyData } from '@Services/utils/copyData';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const MediaParentFormatPartForm = ({ mediaParameterList, setMediaFormatList, values, setFieldValue }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.imageFormatsApi.getAllImageFormat({ active: true }).then((result) => {
                if (result.result) {
                    setList(result.imageFormat);
                } else {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur');
                }
            });
        });
    }, [dispatch]);

    const handleCheckboxChange = (item) => {
        var arrayList = mediaParameterList.replace(/\s+/g, '').split(',');
        var imageFormats = [...values?.imageFormats];
        var indexValue = arrayList.indexOf(item.id.toString());
        var idListImageFormat = list.map((el) => el.id);

        if (indexValue !== -1) {
            arrayList.splice(indexValue, 1);
            imageFormats = imageFormats?.filter((imageFormat) => imageFormat.id !== item.id);
            setFieldValue('imageFormats', imageFormats);
        } else {
            arrayList.push(item.id.toString());
            imageFormats.push(list[idListImageFormat.indexOf(item.id)]);

            setFieldValue('imageFormats', imageFormats);

            if (!values.imageFormats) {
                setFieldValue('imageFormats', item.id);
            }
        }
        setMediaFormatList(arrayList.toString());
    };

    return (
        <Grid container spacing={2}>
            <FormControl fullWidth sx={{ marginBlock: 3, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                {list.map((item) => (
                    <Grid item key={item.id}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mediaParameterList ? mediaParameterList.replace(/\s+/g, '').split(',').includes(String(item.id)) : false}
                                    onChange={() => handleCheckboxChange(item)}
                                    value={item.id}
                                    name={item.name}
                                    color="primary"
                                />
                            }
                            label={item.name}
                        />
                    </Grid>
                ))}
            </FormControl>
        </Grid>
    );
};
