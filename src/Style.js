// Set style for by returning the style object to the respective element
const countryButtonStyle = (country, isMouseOver, isFocus, theme) => {
    if (isMouseOver === country) {
        if (theme === "light") {
            return {
                backgroundColor: 'red',
                color: "white",
                transition: "all 0.3s ease"
            };
        }
        else if (theme === "dark") {
            return {
                backgroundColor: '#fefee3',
                color: "black",
                transition: "all 0.3s ease"
            };
        }
    }
    else if (isFocus === country) {
        if (theme === "light") {
            return {
                backgroundColor: "transparent",
                border: "none",
                borderBottom: '2px solid red'
            }
        }
        else if (theme === "dark") {
            return {
                backgroundColor: "transparent",
                border: "none",
                borderBottom: '2px solid white',
                color: "white"
            }
        }
    }
    else {
        if (theme === "light") {
            return {
                border: "none",
                borderBottom: "2px solid transparent", // Reserve space to avoid shifting
                borderRadius: 0,
                backgroundColor: "transparent", // Optional
                color: "black"
            };
        }
        else if (theme === "dark") {
            return {
                border: "none",
                borderBottom: "2px solid transparent", // Reserve space to avoid shifting
                borderRadius: 0,
                backgroundColor: "transparent", // Optional
                color: "white"
            };
        }
    }
}

//Set the sytle for news link on hover
const newsLinkStyle = (isNewsLinkMouseOver, theme) => {
    if (isNewsLinkMouseOver) {
        return {
            color: "blue",
            textDecoration: "none",
        }
    }
    else {
        return {
            color: "black",
            textDecoration: "none",
        }
    }
}

// Set style for article title
const articleTitleStyle = (idx, idxArray) => {
    if (idxArray.includes(idx)) {
        return {
            backgroundColor: "#D84040",
            color: "white",
            outline: "none",
            boxShadow: "none",
        };
    }
    else {
        return {
            outline: "none",
            boxShadow: "none"
        };
    }
}

// Style for country-category in the navbar dropdown
const navbarDropdownStyle = (isActive, theme) => {
    if (isActive) {
        return {
            backgroundColor: "#74c69d",
            color: "white",
            outline: "none",
            boxShadow: "none",
            userSelect: "none",
        };
    } else {
        return {
            backgroundColor: "transparent",
            color: theme === "light" ? "black" : "white",
        };
    }
};

//Card style for dark and light theme
const outerCardStyle =(theme) => {
    return {
        backgroundColor: theme === "dark" ? "#343a40" : "#CAE8BD",
        color: theme === "dark" ? "white" : "black",
    }
};

//Card style for dark and light theme
const innerCardStyle = (theme) => {
    return {
        backgroundColor: theme === "dark" ? "#343a40" : "#FFF4A4",
        color: theme === "dark" ? "white" : "black",
        border: theme === "dark" ? "1px solid grey" : ""
    }
};
// Card body style
const bodyCardStyle = (theme) => {
    return {
        backgroundColor: theme === "dark" ? "#254D70" : "#FED16A",
        color: theme === "dark" ? "white" : "black"
    }
}

export { countryButtonStyle, newsLinkStyle, articleTitleStyle, navbarDropdownStyle, outerCardStyle, innerCardStyle, bodyCardStyle };