
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