var selectedBuilding = "";

function Building (cost, output) {
    this.cost = cost;
    this.output = output;
}

var buildings = {
    house: new Building({gold: 10}, {gold: 1, fish: -1, beer: -1}),
    fisherie: new Building({gold: 5}, {gold: -1, fish: 5}),
    brewery: new Building({gold: 5}, {gold: -1, beer: 5})
}

var constructedBuildings = {
    house: 0,
    fisherie: 0,
    brewery: 0
};

var resources = {
    gold: 100,
    fish: 0,
    beer: 0
}

var world  = null;

$(function() {
    $(".build").click(function() {
        selectedBuilding = $(this).attr("id");
        $("#selected").text(selectedBuilding);
    });
    drawConstructedBuildings();
    drawResources();
});


function build(x, y) {
    if (!selectedBuilding) {
        return false;
    }
    
    if (resources['gold'] <= buildings[selectedBuilding].cost.gold) {
        return false;
    }
    
    if (!constructedBuildings[selectedBuilding]) {
        constructedBuildings[selectedBuilding] = 0;
    }
    
    constructedBuildings[selectedBuilding]++;
    resources['gold'] -= buildings[selectedBuilding].cost.gold;
    
    return selectedBuilding;
};

function destroy(buildingName) {
    constructedBuildings[buildingName]--;
}


function giveResources() {
    for(var buildingName in constructedBuildings) {
        var count = constructedBuildings[buildingName];
        var buildingOutput = buildings[buildingName].output;
        for(var resourceName in buildingOutput) {
            var value = buildingOutput[resourceName] * count;
            resources[resourceName] += value;
        }
    }
}

function drawConstructedBuildings() {
    var constructedBuildingsText = "";
    for (var buildingName in constructedBuildings) {
        var count = constructedBuildings[buildingName];
        constructedBuildingsText += buildingName + ": " + count + "<br>";
    }
    $("#constructed").html(constructedBuildingsText);  
}

function drawResources() {
    var resourcesText = "";
    for (var resource in resources) {
        var count = resources[resource];
        resourcesText += resource + ": " + count + "<br>";
    }
    $("#resources").html(resourcesText);
}

function checkResources() {
    for (var resource in resources) {
        if(resources[resource] < 0) {
            $("canvas").after($("<div style='height: 500px'><h1>YOU LOSE<br>Your resources went into negatives<br><a href='javascript:location.reload()'>(Retry)</h1><div>"));
            $("canvas").remove();
        }
    }
}