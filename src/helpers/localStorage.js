export const setDataToLS = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
};

export const getDataFromLS = (key) => (
    JSON.parse(localStorage.getItem(key))
);