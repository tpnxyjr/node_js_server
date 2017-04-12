
var prodTags = [
        "622 - 2\" FAUXWOOD SMOOTH",
        "632 - 2\" FAUXWOOD EMBOSSED",
        "660 - 4P VERTICAL WAND",
        //"610 - 1\" ALUMINUM",
        "662 - 4P VERTICAL CORD & CHAIN"
        //"663 - 8P VERTICAL"
        //"2.5\" FAUXWOOD",
        //"690 - ROLLER SHADE",
        //"640 - 2\" WOOD BLIND"
    ];
var profTags = [
    "900 - SMOOTH",
    "902 - EMBOSSED",
    "121 - CONTRACT 22G",
    "122 - PREMIUM 27G",
    "126 - EMBOSSED"
];
var colorTags = [
    "205 - WHITE",
    "112 - OFF-WHITE",
    "040 - IVORY",
    "301 - SNOW WHITE",
    "926 - ALABASTER",
    "613 - OFF-WHITE",
    "926 - ALABASTER",
    "605 - PEARL WHITE",
    "101 - WHITE",
    "621 - BRIGHT WHITE",
    "615 - BIRCH",
    "620 - NATURAL OAK",
    "618 - CHERRY",
    "DESIGNER - THIN BARK",
    "DESIGNER - AQUA STREAK",
    "DESIGNER - AQUA FLOW",
    "DESIGNER - WIND FLOW",
    "DESIGNER - TWIST BARK",
    "DESIGNER - FLOWER CREST"
];
var profSelect={
        FAUXWOOD:[
            {name:"900 - SMOOTH" },
            {name:"902 - EMBOSSED"},
            {name:"904 - SANDBLAST"}
        ],
        VERTICAL:[
            {name:"121 - CONTRACT 22G"},
            {name:"122 - PREMIUM 27G"},
            {name:"126 - EMBOSSED"},
            {name:"123 - RIB"},
            {name:"124 - FLAT"}
        ]
        /*OTHERS:[
            {name:"125 - PERFORATE"}
        ]*/
};
var colorSelect= {
        VERTICALS:[
            {name:"205 - WHITE"},
            {name:"112 - OFF-WHITE"},
            {name:"040 - IVORY"}
        ],
        EMBOSSED:[
            {name:"301 - SNOW WHITE"},
            {name:"926 - ALABASTER"},
            {name:"613 - OFF-WHITE"}
        ],
        HORIZONTAL:[
            {name:"301 - SNOW WHITE"},
            {name:"613 - OFF-WHITE"},
            {name:"926 - ALABASTER"},
            {name:"605 - PEARL WHITE"},
            {name:"101 - WHITE"},
            {name:"621 - BRIGHT WHITE"},
            {name:"615 - BIRCH"},
            {name:"620 - NATURAL OAK"},
            {name:"618 - CHERRY"}
        ],
        DESIGNER:[
            {name:"140 - THIN BARK"},
            {name:"141 - AQUA STREAK"},
            {name:"142 - AQUA FLOW"},
            {name:"143 - WIND FLOW"},
            {name:"144 - TWIST BARK"},
            {name:"145 - FLOWER CREST"}
        ]
};

var numberconvert={};
numberconvert['622'] = '2\" FAUXWOOD SMOOTH';
numberconvert['622'] = '2\" FAUXWOOD EMBOSSED';
numberconvert['660'] = '4P VERTICAL WAND';
numberconvert['610'] = '1\" ALUMINUM';
numberconvert['663'] = '8P VERTICAL';
numberconvert['662'] = '4P VERTICAL CORD & CHAIN';
numberconvert['632'] = '2\" FAUXWOOD';
numberconvert['628'] = '2.5\" FAUXWOOD';
numberconvert['690'] = 'ROLLERSHADE';
numberconvert['640'] = '2\" WOOD BLIND';
numberconvert['900'] = 'SMOOTH';
numberconvert['902'] = 'EMBOSS';
numberconvert['904'] = 'SANDBLAST';
numberconvert['121'] = 'CONTRACT 22G';
numberconvert['122'] = 'PREMIUM 27G';
numberconvert['123'] = 'RIB';
numberconvert['124'] = 'FLAT';
numberconvert['125'] = 'PERFORATE';
numberconvert['126'] = 'EMBOSS';
numberconvert['127'] = 'PRINT';
numberconvert['140'] = 'DESIGNER - THIN BARK';
numberconvert['141'] = 'DESIGNER - AQUA STREAK';
numberconvert['142'] = 'DESIGNER - AQUA FLOW';
numberconvert['143'] = 'DESIGNER - WIND FLOW';
numberconvert['144'] = 'DESIGNER - TWIST BARK';
numberconvert['145'] = 'DESIGNER - FLOWER CREST';
numberconvert['202'] = 'SMOOTH';
numberconvert['910'] = 'SMOOTH';
numberconvert['101'] = 'WHITE';
numberconvert['301'] = 'SNOW';
numberconvert['605'] = 'PEARL';
//numberconvert['610'] = 'OYSTER';
numberconvert['613'] = 'OFF-WHITE';
numberconvert['615'] = 'BIRCH';
numberconvert['620'] = 'NATURAL';
numberconvert['621'] = 'RIGHT WHITE';
numberconvert['926'] = 'ALABASTER';
numberconvert['205'] = 'WHITE';
numberconvert['112'] = 'OFF-WHITE';
numberconvert['040'] = 'IVORY';
numberconvert['E101']= 'E101-WHITE';
numberconvert['E301']= 'E301-SNOW';
numberconvert['E605']= 'E605-PEARL';
numberconvert['E610']= 'E610-OYSTER';
numberconvert['E613']= 'E613-OFF-WHITE';
numberconvert['E615']= 'E615-BIRCH';
numberconvert['E620']= 'E620-NATURAL';
numberconvert['E621']= 'E621-RIGHT WHITE';
numberconvert['E926']= 'E926-ALABASTER';
numberconvert['618']= 'CHERRY';

var prodhash = {};
prodhash['2\" FAUXWOOD']=1.85;
prodhash['4P VERTICAL WAND']=0.19;
prodhash['1\" ALUMINUM']=1.1;
prodhash['8P VERTICAL']=0.155;
prodhash['4P VERTICAL CORD & CHAIN']=0.19;
prodhash['2\" FAUXWOOD']=1.85;
prodhash['2.5\" FAUXWOOD']=1.85;
prodhash['ROLLERSHADE']=4.25;
prodhash['2\" WOOD BLIND']=4.25;

var profhash= {};
profhash['HSMOOTH']=1;
profhash['HEMBOSS']=1.1;
profhash['HSANDBLAST']=1.1;

profhash['VCONTRACT 22G']=0.1075;
profhash['VSMOOTH']=0.1075;
profhash['VPREMIUM 27G']=0.12363;
profhash['VRIB']=0.13975;
profhash['VFLAT']=0.13975;
profhash['VPERFORATE']=0.13975;
profhash['VEMBOSS']=0.1935;
profhash['VPRINT']=0.1935;

var colorhash={};
colorhash['WHITE']=1.1;
colorhash['SNOW']=1;
colorhash['SNOW WHITE']=1;
colorhash['PEARL']=1.1;
colorhash['OYSTER']=1.1;
colorhash['OFF-WHITE']=1;
colorhash['BIRCH']=1.1;
colorhash['NATURAL']=1.1;
colorhash['NATURAL OAK']=1.1;
colorhash['RIGHT WHITE']=1.1;
colorhash['ALABASTER']=1.1;
colorhash['CHESTNUT']=1.1;
colorhash['CHERRY']=1.1;
colorhash['GOLDEN OAK']=1.1;
colorhash['PECAN']=1.1;
colorhash['COTTAGE']=1.1;
colorhash['CHERRYWOOD']=1.1;
colorhash['MAHOGANY']=1.1;
colorhash['IVORY']=1;
colorhash['DESIGNER']=0.18275;
colorhash['LIGHT GRAY']=1.2;
colorhash['E101-WHITE']=1.1;
colorhash['E301-SNOW']=1;
colorhash['E605-PEARL']=1.1;
colorhash['E610-OYSTER']=1.1;
colorhash['E613-OFF-WHITE']=1;
colorhash['E615-BIRCH']=1.1;
colorhash['E620-NATURAL']=1.1;
colorhash['E621-RIGHT WHITE']=1.1;
colorhash['E926-ALABASTER']=1;
colorhash['CHERRY']=1.1;

var ratinghash={};
ratinghash['RC01']=0.00;
ratinghash['RC02']=5.00;
ratinghash['RC03']=6.50;
ratinghash['RC04']=7.70;
ratinghash['RC05']=8.70;
ratinghash['RC06']=10.00;
ratinghash['RC07']=12.00;
ratinghash['RC08']=14;
ratinghash['RC09']=16.00;
ratinghash['RC10']=18.5;
ratinghash['RC11']=20.00;
ratinghash['RC12']=21.5;

var ctrlhash={};
ctrlhash['VW']=1;
ctrlhash['VC']=1.15;
ctrlhash['HW']=2;
ctrlhash['HC']=0;

var valhash={};
valhash[36]=2.75;
valhash[48]=3.5;
valhash[54]=3.75;
valhash[60]=4.5;
valhash[66]=5.25;
valhash[72]=6;
valhash[78]=6.75;
valhash[84]=7.5;
valhash[90]=8.25;
valhash[98]=9.25;
valhash[102]=9.75;
valhash[120]=10.5;
valhash[132]=12;
valhash[156]=14.5;
valhash[198]=17;

var datahash={};
datahash['SIZE101']=1;
datahash['SIZE1010']=1.1;
datahash['SIZE1011']=1.1;
datahash['SIZE1012']=1.1;
datahash['SIZE1013']=1.1;
datahash['SIZE102']=1;
datahash['SIZE103']=1;
datahash['SIZE104']=1;
datahash['SIZE105']=1;
datahash['SIZE106']=1;
datahash['SIZE107']=1;
datahash['SIZE108']=1;
datahash['SIZE109']=1.1;
datahash['SIZE11']=1.531208499;
datahash['SIZE110']=2.5;
datahash['SIZE111']=2.5;
datahash['SIZE1110']=1.1;
datahash['SIZE1111']=1.1;
datahash['SIZE1112']=1.1;
datahash['SIZE1113']=1.1;
datahash['SIZE112']=2.5;
datahash['SIZE113']=2.5;
datahash['SIZE114']=1;
datahash['SIZE115']=1;
datahash['SIZE116']=1;
datahash['SIZE117']=1;
datahash['SIZE118']=1;
datahash['SIZE119']=1.1;
datahash['SIZE12']=1.531208499;
datahash['SIZE121']=1.1;
datahash['SIZE1210']=1.21;
datahash['SIZE1211']=1.21;
datahash['SIZE1212']=1.21;
datahash['SIZE1213']=1.21;
datahash['SIZE122']=1.1;
datahash['SIZE123']=1.1;
datahash['SIZE124']=1.1;
datahash['SIZE125']=1.1;
datahash['SIZE126']=1.1;
datahash['SIZE127']=1.1;
datahash['SIZE128']=1.1;
datahash['SIZE129']=1.21;
datahash['SIZE13']=1.531208;
datahash['SIZE131']=1.1;
datahash['SIZE1310']=1.21;
datahash['SIZE1311']=1.21;
datahash['SIZE1312']=1.21;
datahash['SIZE1313']=1.21;
datahash['SIZE132']=1.1;
datahash['SIZE133']=1.1;
datahash['SIZE134']=1.1;
datahash['SIZE135']=1.1;
datahash['SIZE136']=1.1;
datahash['SIZE137']=1.1;
datahash['SIZE138']=1.1;
datahash['SIZE139']=1.21;
datahash['SIZE14']=3.5;
datahash['SIZE141']=1.1;
datahash['SIZE1410']=1.21;
datahash['SIZE1412']=1.21;
datahash['SIZE1413']=1.21;
datahash['SIZE142']=1.1;
datahash['SIZE143']=1.1;
datahash['SIZE144']=1.1;
datahash['SIZE145']=1.1;
datahash['SIZE146']=1.1;
datahash['SIZE147']=1.1;
datahash['SIZE148']=1.1;
datahash['SIZE149']=1.21;
datahash['SIZE15']=3.25;
datahash['SIZE1510']=1.21;
datahash['SIZE1511']=1.21;
datahash['SIZE1512']=1.21;
datahash['SIZE1513']=1.21;
datahash['SIZE152']=1.21;
datahash['SIZE153']=1.1;
datahash['SIZE154']=1.1;
datahash['SIZE155']=1.1;
datahash['SIZE156']=1.1;
datahash['SIZE157']=1.1;
datahash['SIZE158']=1.1;
datahash['SIZE159']=1.21;
datahash['SIZE16']=3;
datahash['SIZE161']=1.1;
datahash['SIZE1610']=1.21;
datahash['SIZE1611']=1.21;
datahash['SIZE1612']=1.21;
datahash['SIZE1613']=1.21;
datahash['SIZE162']=1.1;
datahash['SIZE163']=1.1;
datahash['SIZE164']=1.1;
datahash['SIZE165']=1.1;
datahash['SIZE166']=1.1;
datahash['SIZE167']=1.1;
datahash['SIZE168']=1.1;
datahash['SIZE169']=1.21;
datahash['SIZE17']=2.8;
datahash['SIZE171']=1.1;
datahash['SIZE1710']=1.21;
datahash['SIZE1711']=1.21;
datahash['SIZE1712']=1.21;
datahash['SIZE1713']=1.21;
datahash['SIZE172']=1.1;
datahash['SIZE173']=1.1;
datahash['SIZE174']=1.1;
datahash['SIZE175']=1.1;
datahash['SIZE176']=1.1;
datahash['SIZE177']=1.1;
datahash['SIZE178']=1.1;
datahash['SIZE179']=1.1;
datahash['SIZE18']=2.7;
datahash['SIZE181']=1.1;
datahash['SIZE1810']=1.21;
datahash['SIZE1811']=1.21;
datahash['SIZE1812']=1.21;
datahash['SIZE1813']=1.21;
datahash['SIZE182']=1.1;
datahash['SIZE183']=1.1;
datahash['SIZE184']=1.1;
datahash['SIZE185']=1.1;
datahash['SIZE186']=1.1;
datahash['SIZE187']=1.1;
datahash['SIZE188']=1.1;
datahash['SIZE189']=1.21;
datahash['SIZE19']=2.5;
datahash['SIZE1910']=1.21;
datahash['SIZE1911']=1.21;
datahash['SIZE1912']=1.21;
datahash['SIZE1913']=1.21;
datahash['SIZE199']=1.21;
datahash['SIZE2010']=1.21;
datahash['SIZE2011']=1.21;
datahash['SIZE2012']=1.21;
datahash['SIZE2013']=1.21;
datahash['SIZE209']=1.21;
datahash['SIZE21']=1.531208499;
datahash['SIZE210']=1.3;
datahash['SIZE211']=1.3;
datahash['SIZE212']=1.3;
datahash['SIZE213']=1.3;
datahash['SIZE22']=1.531208499;
datahash['SIZE23']=1.531208499;
datahash['SIZE24']=1.9;
datahash['SIZE25']=1.7;
datahash['SIZE26']=1.55;
datahash['SIZE27']=1.45;
datahash['SIZE28']=1.4;
datahash['SIZE29']=1.3;
datahash['SIZE31']=1.531208499;
datahash['SIZE32']=1.531208499;
datahash['SIZE33']=1.531208499;
datahash['SIZE34']=1.398406375;
datahash['SIZE35']=1.3187251;
datahash['SIZE36']=1.1770695;
datahash['SIZE37']=1.077594384;
datahash['SIZE38']=1;
datahash['SIZE41']=1.398406375;
datahash['SIZE410']=1.3;
datahash['SIZE411']=1.3;
datahash['SIZE412']=1.3;
datahash['SIZE413']=1.3;
datahash['SIZE42']=1.398406375;
datahash['SIZE43']=1.398406375;
datahash['SIZE44']=1.25498008;
datahash['SIZE45']=1.15936255;
datahash['SIZE46']=1.075697211;
datahash['SIZE47']=1.035856574;
datahash['SIZE48']=1;
datahash['SIZE49']=1.3;
datahash['SIZE51']=1.3187251;
datahash['SIZE510']=1.1;
datahash['SIZE511']=1.1;
datahash['SIZE512']=1.1;
datahash['SIZE513']=1.1;
datahash['SIZE52']=1.3187251;
datahash['SIZE53']=1.3187251;
datahash['SIZE54']=1.15936255;
datahash['SIZE55']=1.032669323;
datahash['SIZE56']=1;
datahash['SIZE57']=1;
datahash['SIZE58']=1;
datahash['SIZE59']=1.1;
datahash['SIZE61']=1.1770695;
datahash['SIZE610']=1.1;
datahash['SIZE611']=1.1;
datahash['SIZE612']=1.1;
datahash['SIZE613']=1.1;
datahash['SIZE62']=1.1770695;
datahash['SIZE63']=1.1770695;
datahash['SIZE64']=1.035856574;
datahash['SIZE65']=1;
datahash['SIZE66']=1;
datahash['SIZE67']=1;
datahash['SIZE68']=1;
datahash['SIZE69']=1.1;
datahash['SIZE71']=1.151773857;
datahash['SIZE710']=1.1;
datahash['SIZE711']=1.1;
datahash['SIZE712']=1.1;
datahash['SIZE713']=1.1;
datahash['SIZE72']=1.151773857;
datahash['SIZE73']=1.151773857;
datahash['SIZE74']=1;
datahash['SIZE75']=1;
datahash['SIZE76']=1;
datahash['SIZE77']=1;
datahash['SIZE78']=1;
datahash['SIZE79']=1.1;
datahash['SIZE81']=1.062416999;
datahash['SIZE810']=1.1;
datahash['SIZE811']=1.1;
datahash['SIZE812']=1.1;
datahash['SIZE813']=1.1;
datahash['SIZE82']=1.062416999;
datahash['SIZE83']=1.062416999;
datahash['SIZE84']=1;
datahash['SIZE85']=1;
datahash['SIZE86']=1;
datahash['SIZE87']=1;
datahash['SIZE88']=1;
datahash['SIZE89']=1.1;
datahash['SIZE91']=1;
datahash['SIZE910']=1.1;
datahash['SIZE911']=1.1;
datahash['SIZE912']=1.1;
datahash['SIZE913']=1.1;
datahash['SIZE92']=1;
datahash['SIZE93']=1;
datahash['SIZE94']=1;
datahash['SIZE95']=1;
datahash['SIZE96']=1;
datahash['SIZE97']=1;
datahash['SIZE98']=1;
datahash['SIZE99']=1.1;

var production = {};
production['perpctime']={};
production['perpctime']['1\" ALUMINUM']=12;
production['perpctime']['2\" FAUXWOOD SMOOTH']=25;
production['perpctime']['2\" FAUXWOOD EMBOSSED']=27;
production['perpctime']['4P VERTICAL WAND']=8;
production['perpctime']['4P VERTICAL CORD & CHAIN']=11;
production['perpctime']['2.5\" FAUXWOOD']=18;
production['perpctime']['ROLLER SHADE']=40;
production['perpctime']['2\" WOOD BLIND']=22;
production['matgather']={};
production['matgather']['1\" ALUMINUM'] = 0.03;
production['matgather']['2\" FAUXWOOD SMOOTH'] = 0.05;
production['matgather']['2\" FAUXWOOD EMBOSSED'] = 0.05;
production['matgather']['4P VERTICAL WAND'] = 0.05;
production['matgather']['4P VERTICAL CORD & CHAIN'] = 0.04;
production['matgather']['2.5\" FAUXWOOD'] = 0.03;
production['matgather']['ROLLER SHADE'] = 0.05;
production['matgather']['2\" WOOD BLIND'] = 0.07;
production['slatcut']={};
production['slatcut']['1\" ALUMINUM']=0.12;
production['slatcut']['2\" FAUXWOOD SMOOTH']=0.05;
production['slatcut']['2\" FAUXWOOD EMBOSSED']=0.05;
production['slatcut']['4P VERTICAL WAND']=0.25;
production['slatcut']['4P VERTICAL CORD & CHAIN']=0.16;
production['slatcut']['2.5\" FAUXWOOD']=0.05;
production['slatcut']['ROLLER SHADE']=0.27;
production['slatcut']['2\" WOOD BLIND']=0.15;
production['threading']={};
production['threading']['1\" ALUMINUM']=0.12;
production['threading']['2\" FAUXWOOD SMOOTH']=0.10;
production['threading']['2\" FAUXWOOD EMBOSSED']=0.10;
production['threading']['4P VERTICAL WAND']=0;
production['threading']['4P VERTICAL CORD & CHAIN']=0;
production['threading']['2.5\" FAUXWOOD']=0.27;
production['threading']['ROLLER SHADE']=0;
production['threading']['2\" WOOD BLIND']=0.20;
production['assembly']={};
production['assembly']['1\" ALUMINUM']=0.32;
production['assembly']['2\" FAUXWOOD SMOOTH']=0.19;
production['assembly']['2\" FAUXWOOD EMBOSSED']=0.19;
production['assembly']['4P VERTICAL WAND']=0.23;
production['assembly']['4P VERTICAL CORD & CHAIN']=0.33;
production['assembly']['2.5\" FAUXWOOD']=0.12;
production['assembly']['ROLLER SHADE']=0.40;
production['assembly']['2\" WOOD BLIND']=0.30;
production['cutdown']={};
production['cutdown']['1\" ALUMINUM']=0.20;
production['cutdown']['2\" FAUXWOOD SMOOTH']=0.16;
production['cutdown']['2\" FAUXWOOD EMBOSSED']=0.16;
production['cutdown']['4P VERTICAL WAND']=0.18;
production['cutdown']['4P VERTICAL CORD & CHAIN']=0.09;
production['cutdown']['2.5\" FAUXWOOD']=0.19;
production['cutdown']['ROLLER SHADE']=0;
production['cutdown']['2\" WOOD BLIND']=0.20;
production['packaging']={};
production['packaging']['1\" ALUMINUM']=0.05;
production['packaging']['2\" FAUXWOOD SMOOTH']=0.07;
production['packaging']['2\" FAUXWOOD EMBOSSED']=0.07;
production['packaging']['4P VERTICAL WAND']=0.07;
production['packaging']['4P VERTICAL CORD & CHAIN']=0.06;
production['packaging']['2.5\" FAUXWOOD']=0.07;
production['packaging']['ROLLER SHADE']=0.08;
production['packaging']['2\" WOOD BLIND']=0.08;
