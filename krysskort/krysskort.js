(function() {
    var krysskort = {
        lookupData: [],
        listData: [],
        renderData: {},
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
            var $styles = krysskort.renderData.$styles = `
            <style type="text/css">
            html {
                font-size:14px;
            }
            body {
                overflow:hidden;
            }
            #render {
                position: fixed; z-index: 100000;
                top: 0; left: 0; right: 0; bottom: 0,
                width: 100%; height: 100%;
                background-color: #fff;
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
            #render ul {
                border: 2px solid silver;
                padding: 0;
                margin: 3rem;
                display: grid;
                grid-auto-flow: column;
                grid-template-rows: repeat(50, 1fr);
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
            #render ul li span {
                float: right;
                font-size: 80%;
                line-height: 1.7rem;
                color: #999;
                font-weight:normal;
            }
            </style>
            `;

            var $renderDiv = krysskort.renderData.$renderDiv = $("<div id='render'><b>&times;</b></div>").appendTo(document.body)
            $renderDiv.find("b").click(function(e) {
                krysskort.destroy();
            });
            var $ul = $("<ul class='grid-size-70'/>");

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

            $(document.body).append($styles);
            $ul.append(listHtml).append(listHtmlBonus);
            $renderDiv.append($ul);
        }, 
        destroy: function() {
            $(krysskort.renderData.$styles).remove();
            $(krysskort.renderData.$renderDiv).remove();
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
