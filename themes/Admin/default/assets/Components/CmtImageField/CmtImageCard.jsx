import { Card } from "@mui/material";
import { styled } from "@mui/system";

export const CmtImageCard = styled(Card)`
    width: ${(props) => (props.width ? props.width : '50%')};
    margin-top: 4px;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    cursor: pointer;

    & > img {
        object-fit: cover;
        height: ${(props) => (props.height ? props.height : '150px')};
    }
    & > .placeholder {
        height: ${(props) => (props.height ? props.height : '150px')};
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${(props) => props.theme.palette.crud.create.backgroundColor};
        & > .MuiSvgIcon-root {
            font-size: 70px;
        }
    }
`;