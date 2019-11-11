var krysskort = {
    loadSpeciesList: function() {
        const response = await fetch('specieslist.json');
        const myJson = await response.json();
        console.log(myJson);
        console.log("now!");
    }
};
krysskort.loadSpeciesList();
