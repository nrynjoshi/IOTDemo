import * as d3 from "d3";

export const BACKEND_API_CALL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_DEV_API_URL;
export const COLOR_SCALE = d3.scaleOrdinal()
    .range(["#C0C0C0", "#808080", "#FF0000", "#800000", "#FFFF00", "#808000", "#00FF00", "#008000", "#00FFFF",
     "#008080", "#0000FF", "#000080", "#FF00FF", "#800080", "#CD5C5C", "#F08080", "#E9967A", "#FFA07A", "#DFFF00", "#6495ED", "#CCCCFF", "#40E0D0", "#9FE2BF"
     , "#800980", "#CD525C", "#F08580", "#E9867A", "#FF507A", "#DF3F00", "#6415ED", "#CCC1FF", "#4010D0", "#9FE2AF"]);
