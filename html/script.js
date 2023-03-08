$('#creatormenu').fadeOut(0);

window.addEventListener('message', function(event) {
    const action    = event.data.action;
    const custom    = event.data.customize;
    const shopData  = event.data.shopData;
    const horseData = event.data.myHorsesData;

    if (action === "hide") {$("#creatormenu").fadeOut(500);};
    if (action === "show") {$("#creatormenu").fadeIn(500);};
    if (custom === true)   {$('#button-customization').removeClass("disabled");};
    if (custom === false)  {$('#button-customization').addClass("disabled");};

    if (shopData) {
        for (const [index, table] of Object.entries(shopData)) {
            const horseBreed = table.breed;
            if ($(`#page_shop .scroll-container .collapsible #${index}`).length <= 0) {
                $('#page_shop .scroll-container .collapsible').append(`
                    <li id="${index}">
                        <div class="collapsible-header col s12 panel ">
                            <div class="col s12 panel-title">
                                <h6 class="grey-text">${horseBreed}</h6>
                            </div>
                        </div>
                        <div class="collapsible-body item-bg"></div>
                    </li>
                `);
            };
            for (const [_, horseData] of Object.entries(table)) {
                if (_ != 'breed') {
                    let Modelhorse;
                    const horseColor = horseData.color;
                    const priceCash  = horseData.cashPrice;
                    const priceGold  = horseData.goldPrice;
                    $(`#page_shop .scroll-container .collapsible #${index} .collapsible-body`).append(`
                        <div id="${_}" onhover="loadHorse(this)" class="col s12 panel item">
                            <div class="col s6 panel-col item">
                                <h6 class="grey-text-shop title">${horseColor}</h6>
                            </div>          
                            <div class="buy-buttons">
                                <button class="btn-small"  onclick="buyHorse('${_}', ${priceCash}, true)">
                                    <img src="img/money.png"><span class="horse-price">${priceCash}</span>
                                </button>                                  
                                <button class="btn-small"  onclick="buyHorse('${_}', ${priceGold}, false)">                                                
                                    <img src="img/gold.png"><span class="horse-price">${priceGold}</span>
                                </button>                                          
                            </div>
                        </div>
                    `);
                    $(`#page_shop .scroll-container .collapsible #${index} .collapsible-body #${_}`).hover(function() {                       
                        $(this).click(function() {                        
                            $(Modelhorse).addClass("selected");
                            $('.selected').removeClass("selected"); 
                            Modelhorse = $(this).attr('id');                       
                            $(this).addClass('selected');
                            $.post('http://oss_stables/loadHorse', JSON.stringify({horseModel: $(this).attr('id')}));
                        });                       
                    }, function() {});
                };
            };
        };
    };
    if (horseData) {
        $('#page_myhorses .scroll-container .collapsible').html('');
        $('.collapsible').collapsible();
        for (const [ind, tab] of Object.entries(horseData)) {
            const horseName = tab.name;
            const horseID = tab.id;
            const horseModel = tab.model;
            const components = tab.components;
            $('#page_myhorses .scroll-container .collapsible').append(`
                <li>
                    <div id="heads" class="collapsible-header col s12 panel">
                        <div class="col s12 panel-title">
                            <h6 class="grey-text">${horseName}</h6>
                        </div>
                    </div>
                    <div class="collapsible-body col s12 panel item" id="${horseID}">
                        <div class="col s6 panel-col item" onclick="SelectHorse(${horseID})">
                            <h6 class="grey-text title">Select</h6>
                        </div>
                        <div class="col s6 panel-col item" onclick="SellHorse(${horseID})">
                            <h6 class="grey-text title">Sell</h6>
                        </div>
                    </div>
                </li> 
            `);
            $(`#page_myhorses .scroll-container .collapsible #${horseID}`).hover(function() {  
                $(this).click(function() { 
                    $(horseID).addClass("selected");
                    $('.selected').removeClass("selected");
                    $.post('http://oss_stables/loadMyHorse', JSON.stringify({ IdHorse: horseID, HorseModel: horseModel, HorseComp: components}));
                });                         
            }, function() {});
        };
    };
});

let currentPage = 'page_myhorses';

function confirm() {
    $.post('http://oss_stables/CloseStable');
    $('#button-customization').addClass("disabled");
    $('#page_myhorses .scroll-container .collapsible').html('');
    $('#page_shop .scroll-container .collapsible').html('');
    $("#creatormenu").fadeOut(500);
    resetMenu();
};

function resetMenu() {
    $(`#${currentPage}`).hide();
    currentPage = 'page_myhorses';
    $('#page_myhorses').show();
    $('.menu-selectb.active').removeClass('active');
    $('#button-myhorses.menu-selectb').addClass('active');
};

$('.menu-selectb').on('click', function() {
    $(`#${currentPage}`).hide();
    currentPage = $(this).data('target');
    $(`#${currentPage}`).show();
    $('.menu-selectb.active').removeClass('active');
    $(this).addClass('active');
});

function SelectHorse(IdHorse) {    
    $.post('http://oss_stables/selectHorse', JSON.stringify({horseID: IdHorse}));
};

function rotate() {
    $.post('http://oss_stables/rotate');
};

function buyHorse(modelH, price, isCash) {        
    $('#button-customization').addClass("disabled");
    $('#page_myhorses .scroll-container .collapsible').html('');
    $('#page_shop .scroll-container .collapsible').html('');
    $("#creatormenu").fadeOut(500);
    if (isCash) {        
        $.post('http://oss_stables/BuyHorse', JSON.stringify({ ModelH: modelH, Cash: price, IsCash: isCash }));
    } else {
        $.post('http://oss_stables/BuyHorse', JSON.stringify({ ModelH: modelH, Gold: price, IsCash: isCash }));
    };    
};

function SellHorse(IdHorse) {    
    $.post('http://oss_stables/sellHorse', JSON.stringify({horseID: IdHorse}));
    $('#button-customization').addClass("disabled");
    $('#page_myhorses .scroll-container .collapsible').html('');
    $('#page_shop .scroll-container .collapsible').html('');
    $("#creatormenu").fadeOut(500);
};

$(".button-right").on('click', function() {
    const inputElement = $(this).parent().find('input');
    const component = $(inputElement).attr('id');
    const value = Number($(inputElement).attr('value'));
    const nValue = value + 1;
    const min = $(inputElement).attr('min');
    const max = $(inputElement).attr('max');
    if (nValue > max) {
        nValue = min;
    };
    $(inputElement).attr('value', nValue);
    /*const titleElement = $(this).parent().parent().find('.grey-text-cust');
    titleElement.text(component + ' ' + nValue + '/' + max);*/
    $.post('http://oss_stables/'+ component, JSON.stringify({id: nValue}));
});

$(".button-left").on('click', function() {
    const inputElement = $(this).parent().find('input');
    const component = $(inputElement).attr('id');
    const value = Number($(inputElement).attr('value'));
    const nValue = value - 1;
    const min = $(inputElement).attr('min');
    const max = $(inputElement).attr('max');
    if (nValue < min) {
        nValue = max;
    };
    $(inputElement).attr('value', nValue);
    /*const titleElement = $(this).parent().parent().find('.grey-text-cust');
    titleElement.text(component + ' ' + nValue + '/' + max);*/
    $.post('http://oss_stables/'+ component, JSON.stringify({id: nValue}));
});

/*$(".input-number").on("change paste keyup", function() {
    const min = Number($(this).attr('min'));
    const max = Number($(this).attr('max'));
    const value = $(this).val();
    if (value == '' || value < min) {
        value = min;
        $(this).val(value);
    };
    if (value > max) {
        value = max;
        $(this).val(value);
    };
    const titleElement = $(this).parent().parent().find('.grey-text-cust');
    const text = titleElement.text();    
    const component = text.split(' ')[0];
    titleElement.text(component + ' ' + value + '/' + max);
});*/
