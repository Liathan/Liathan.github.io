
// -------------------------------------------------------------------------
// Init: javascript code always required by the pages
// We can fine the function that permits to add and remove the "responsive"
// icon of the topnav in small devices
//--------------------------------------------------------------------------

/* Toggle between adding and removing the "responsive" class to topnav when the user 
   clicks on the icon on small devices (less than 1024px wide) */
function toggle_icon_menu_topnav() {

    var x = document.getElementById("myTopnav");
    if (x.classList.contains("topnav") && !x.classList.contains("responsive")) {
        x.classList.add("responsive");
        console.log(x.classList)
    } 
    else {
        x.classList.remove("responsive");
        console.log(x.classList)
    }
}

// Possible other palette
//const color = d3.scaleOrdinal().range(["#ff595e", "#ff924c", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#606470"])
const color = d3.scaleOrdinal().range(["#ff595e", "#ff924c", "#8ac926", "#1982c4", "#6a4c93", "#582f0e", "#606470"])
d3.csv("../data/assign1/assign1-plot1.csv").then(function (data)
{
    const trees = [...data.slice(0,6).map(d => d["Species"])]
    trees.push("Others");
    color.domain(trees)
});