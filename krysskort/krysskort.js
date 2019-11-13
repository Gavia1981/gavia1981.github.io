(function() {
    var krysskort = {
        lookupData: [],
        listData: [],
        listSettings: {},
        loadLookupData: function() {
            var url = "https://cdn.jsdelivr.net/gh/Gavia1981/gavia1981.github.io/krysskort/specieslist.json";
            fetch(url)
              .then(function(response) {
                    response.json().then(function(data) {
                        krysskort.lookupData = data;
                        krysskort.loadSpeciesList();
                    });
              })
              .catch(function(error) {
                  console.log(error);
              });  
        },
        loadSpeciesList: function() {
            var settings = $("#specieslistwrapper").data("specieslistsettings");
            eval('krysskort.listSettings='+settings); 
            
            let listData = [];
            let sortNr = 0;
            $("#specieslist tbody tr").each(function() {
                var $thisElem = $(this);
                sortNr++;
                listData.push({
                    speciesId: $thisElem.find("[data-taxonid]").data("taxonid"),
                    sort: sortNr,
                    date: $thisElem.find("td.date").attr("title"),
                    speciesName: $thisElem.find("strong").text()
                });
            });  
            krysskort.listData = listData;
            krysskort.render();
        },
        render: function() {
            var $styles = `
            <style type="text/css" id="renderStyles">
            html {
                font-size:14px;
            }
            body {
                overflow:hidden;
                color:#12203b;
            }
            #render {
                position: fixed; z-index: 100000;
                top: 0; left: 0; right: 0; bottom: 0,
                width: 100%; height: 100%;
                background-color: #f3f6f8;
                overflow: auto;
            }
            #render b {
                position: absolute;
                top:1rem;
                right:1rem;
                font-size:2rem;
                z-index: 5000;
                background-color: #eee;
                padding: 0 1rem;
                border-radius: 10px;
                box-shadow: 0 5px 7px rgba(0,0,0,0.3);
                cursor: pointer;
            }
            #render h3 {
                font-size: 2rem;
                line-height: 1;
                margin: 0;
                border: 2px solid silver;
                padding: 1rem;
                border-bottom: none;
            }
            #render h3 span {
                float:right;
            }
            #render button {
                border: none;
                padding: 0.7rem 1.3rem;
                font-weight: bold;
                text-transform: uppercase;
                border-radius: 5px;
                background-color: #607b94;
                cursor: pointer;
                letter-spacing: 1px;
                color: #fff;
            }
            #render button.active {
                box-shadow: 2px 2px 5px rgba(0,0,0,0.3) inset;
            }
            #render button.active:before {
                content: ' ✓ ';
            }
            #render .listwrapper { 
                margin: 3rem auto;
                padding: 15px;
                border-radius: 10px;
                width: 1400px;
                background-color: #fff;
                box-shadow: 0 1px 3px rgba(16,77,107,.2), 0 5px 15px rgba(16,77,107,.1);
            }
            #render ul {
                border: 2px solid silver;
                padding: 0;
                margin:1rem 0 0;
                display: grid;
                grid-auto-flow: column;
                grid-template-rows: repeat(50, 1fr);
                grid-template-columns: repeat(5, 1fr);
                list-style-type: none;
            }
            #render ul.grid-size-70 {
                grid-template-rows: repeat(70, 1fr);
            }
            #render ul.grid-size-70 li:nth-child(70n-69) {
                border-top:none !important;
            }
            #render ul.grid-size-70 li:nth-child(n+281) {
                border-right: none !important;
            }
            #render ul li:last-child::after {
                content: '.';
                height: 1px;
                border-bottom: 2px solid silver;
                display: block;
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 50000;
            }
            #render ul li {
                border-top:1px dashed #ddd;
                border-right:2px solid #ccc;
                padding:.5em;
                position: relative; 
                padding: .3em .6rem .3rem 3.5rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: flex;
            }
            #render ul li:not(.bonus):before {
                content: ' ';
                position: absolute;
                padding: 0 1rem 0 0.8rem;
                left: 0;
                width: 1rem;
                font-weight: normal;
                border-right: 1px dashed #ddd;
                top: 0;
                bottom: 0;
                font-size: 2rem;
                line-height: 2.5rem;
            }
            #render ul li.rare { 
                font-weight:bold; 
            }
            #render ul li.ticked:before {
                content: ' × ' !important;
            }
            #render ul li.bonus {
                font-weight:bold;
                background-color: #eee;
            }
            #render ul span {
                margin-left: auto;
                font-size: 70%;
                line-height: 1.7rem;
                color: #999;
                font-weight:normal;
            }
            #render ul.hide-date span {
                display:none;
            }
            </style>
            `;

            var $renderDiv = $("<div id='render'><b>&times;</b></div>").appendTo(document.body)
            $renderDiv.find("b").click(function(e) {
                krysskort.destroy();
            });
            var $ul = $("<ul class='grid-size-70 hide-date'/>");

            var listHtml = "";
            for (i in krysskort.lookupData) {
                let ticked = krysskort.listData.filter(x => x.speciesId == krysskort.lookupData[i].speciesId);
                listHtml += "<li class='" + (krysskort.lookupData[i].rarity ? " rare" : "");
                listHtml += (ticked.length ? " ticked" : "") + "'>";
                listHtml += krysskort.lookupData[i].speciesName;
                listHtml += (ticked.length ? "<span>" + ticked[0].date + "</span>" : "");
                listHtml +="</li>";
            }

            var listHtmlBonus = "";
            var bonusCount = 0;
            for (j in krysskort.listData) {
                let ticked = krysskort.lookupData.filter(x => x.speciesId == krysskort.listData[j].speciesId);
                if (!ticked.length) {
                    bonusCount++;
                    listHtmlBonus += "<li class='rare ticked'>" + krysskort.listData[j].speciesName + "</li>"
                }
            }
            if (bonusCount > 0) {
                listHtmlBonus = "<li class='bonus'>BONUSARTER (" + bonusCount + ")</li>" + listHtmlBonus;
            }
            
            var $header = $("<h3>" + krysskort.listSettings.areaName + "<span>" + krysskort.listData.length + " arter</span></h3>");
            var $settings = $("<button>Visa datum</button>").click(function() {
                $ul.toggleClass("hide-date");
                $(this).toggleClass("active");
            });
            
            $(document.body).append($styles);
            $ul.append(listHtml).append(listHtmlBonus);
            $renderDiv.append($ul).find("ul").wrap("<div class='listwrapper'></div>");
            $header.prependTo($renderDiv.find(".listwrapper"));
            $settings.prependTo($renderDiv.find(".listwrapper"));
        }, 
        destroy: function() {
            $("#render, #renderStyles").remove();
            krysskort = {};
        },
        init: function() {
            if ($("#specieslistwrapper").length) {
                krysskort.loadLookupData();
            }
        }
    };
    krysskort.init();
})();
