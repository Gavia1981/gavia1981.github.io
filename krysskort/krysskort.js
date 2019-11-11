var krysskort = {
    loadSpeciesList: function() {
        fetch("specieslist.json")
            .then(response => response.json())
            .then(json => console.log(json));
    }
};
krysskort.loadSpeciesList();
