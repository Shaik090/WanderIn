module.exports.formatCategory = (category) => {
    const categoryMap = {
        "Rooms": "Rooms",
        "Mountains": "Mountains",
        "Castles": "Castles",
        "Iconic-cities": "Iconic cities",
        "Amazing-pools": "Amazing pools",
        "Camping": "Camping",
        "Farms": "Farms",
        "Arctic": "Arctic",
        "Beach": "Beach",
    };
    return categoryMap[category] || category || "No category";
};