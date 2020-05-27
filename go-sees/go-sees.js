$( document ).ready(function() {
var projectBasePath = '';
var bgColor = '#333333';
var projWidth = 640;
var projHeight = 480;
var guidesX = [110, 200, 250, 270];
var guidesY = [33, 50, 280, 330, 345, 370, 385, 105, 170];
var opacityMinMenu = 0.6;
var opacityMaxMenu = 1;
var opacityNowMenu = 0.6;
var opacityIncrement = 0.07;
var alphaSpeed = 0.01;
var menuItems = [];
var MenuItem = function (left, top, width, height, color1, color2, color3, text, font, align)  {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.right = left + width;
    this.bottom = top + height;
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
    this.text = text;
    this.font = font;
    this.align = align;
    this.opacityNow = opacityNowMenu;
    this.goDown = false;
    this.goUp = false;
}
var Player = function (id, src, duration, x, y, fulltext, menu01, menu02, menu03) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.fulltext = fulltext;
    this.opened = false;
    this.playing = false;
    this.barpos = 0; // min = 0, max = 84
    this.visible = false;
    this.fadingOut = false;
    this.active = false;
    this.duration = duration;
    this.alphanow = 1.0;
    this.btns = [];
    this.menu = [];
    this.menubtn = [];
    this.playBtn = new Btn(0, 0, 0, 0, 'play');
    this.openMenuBtn = new Btn(0, 0, 0, 0, 'open');
    this.width = 187;
    this.height = 34;
    if (menu01 === undefined) {}
    else {
        this.menu.push(menu01);
    };
    if (menu02 === undefined) {}
    else {
        this.menu.push(menu02);
    };
    if (menu03 === undefined) {}
    else {
        this.menu.push(menu03);
    };
    this.audiosrc = new Audio(projectBasePath + 'assets/sounds/' + src);
    this.audiosrc.volume = 1;
    this.audiosrc.load();
}
var players = [];
var Btn = function (x, y, width, height, type, playerid) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.hover = false;
    if (playerid === undefined) {}
    else {
        this.playerid = playerid;
    };
};
var allBtns = [];
var paragraphs = [];
var paragraphsInteractive = [];
var ParagraphText = function (id, text, height, question) {
    this.id = id;
    this.text = text;
    this.height = height;
    this.top = 0;
    this.question = question;
    this.spaceAfter = 15;
}
var paragraphsOffsetTarget = 0;
var screens = 0;
/*
        
0 = home
1 = interactive
2 = text
        
*/
var interactiveState = 0;
/*
0 = text
1 = interaction
*/
var playersTopY = 40;
var playerHeight = 34;
var playerWidth = 187;
var playersCols = [12, 11, 12];
var canvas = document.getElementById("project-interactive");
var ctx = canvas.getContext("2d");
var FPS = 30;
setup();

function setup() {
    setupMenu();
    setupText();
    setupInteractive();
    switch (screens) {
    case 1:
        // setup interactive
        break;
    case 2:
        // setup text
        break;
    default:
    }
    setInterval(function () {
        update();
        draw();
    }, 1000 / FPS);
}

function setupMenu() {
    var menuItem = new MenuItem(guidesX[0], guidesY[0] - 9, 0, 9, 255, 255, 255, "003 GO-SEES", "9px Verdana", "left");
    menuItems.push(menuItem);
    var menuItem = new MenuItem(guidesX[1], guidesY[0] - 9, 0, 9, 255, 255, 255, "Interactive", "9px Verdana", "left");
    menuItems.push(menuItem);
    var menuItem = new MenuItem(guidesX[3], guidesY[0] - 9, 0, 9, 255, 255, 255, "Text", "9px Verdana", "left");
    menuItems.push(menuItem);
}

function update() {
    for (var i = 0; i < menuItems.length; i++) {
        if (menuItems[i].goUp == true) {
            if (menuItems[i].opacityNow < opacityMaxMenu) {
                menuItems[i].opacityNow += opacityIncrement;
            }
            else {
                menuItems[i].goUp = false;
            }
        }
        else if (menuItems[i].goDown == true) {
            if (menuItems[i].opacityNow > opacityMinMenu) {
                menuItems[i].opacityNow -= opacityIncrement;
            }
            else {
                menuItems[i].goDown = false;
            }
        }
    }
    for (var j = 0; j < players.length; j++) {
        if (players[j].fadingOut == true && players[j].visible == true) {
            if (players[j].alphanow > 0.01) {
                players[j].alphanow -= alphaSpeed;
            }
            else {
                players[j].fadingOut = false;
                players[j].visible = false;
                players[j].alphanow = 0;
            }
        }
    }
}

function draw() {
    drawBackground();
    switch (screens) {
    case 1:
        // draw interactive
        //drawPlayers();
        if (interactiveState == 0) {
            drawInteractiveText();
            drawMenu();
        }
        else {
            drawMenu();
            drawPlayers();
        }
        break;
    case 2:
        // draw text
        drawText();
        drawMenu();
        break;
    default:
        drawHome();
        drawMenu();
    }
    //drawGuides();
}

function drawBackground() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, projWidth, projHeight);
}

function drawGuides() {
    ctx.lineWidth = 1;
    // set line color
    ctx.strokeStyle = '#ff0000';
    for (i = 0; i < guidesX.length; i++) {
        ctx.moveTo(guidesX[i], 0);
        ctx.lineTo(guidesX[i], projHeight);
        ctx.stroke();
    }
    for (j = 0; j < guidesY.length; j++) {
        ctx.moveTo(0, guidesY[j]);
        ctx.lineTo(projWidth, guidesY[j]);
        ctx.stroke();
    }
}

function drawMenu() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, projWidth, 48);
    for (i = 0; i < menuItems.length; i++) {
        ctx.font = menuItems[i].font;
        ctx.fillStyle = "rgba(" + menuItems[i].color1 + "," + menuItems[i].color2 + "," + menuItems[i].color3 + "," + menuItems[i].opacityNow + ")";
        ctx.textAlign = menuItems[i].align;
        ctx.fillText(menuItems[i].text, menuItems[i].left, menuItems[i].top);
        menuItems[i].width = ctx.measureText(menuItems[i].text).width;
        menuItems[i].right = menuItems[i].left + menuItems[i].width;
        menuItems[i].bottom = menuItems[i].top + menuItems[i].height;
    }
}

function drawHome() {
    ctx.font = "bold 22px Arial";
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "#c1c1c1";
    ctx.textAlign = "left";
    ctx.fillText("GO-SEES", guidesX[1], guidesY[2]);
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#878787";
    ctx.fillText("VOICE Juergen Teller", guidesX[1], guidesY[3]);
    ctx.fillText("DESIGN & SOUND Miles Murray-Sorrell (Fuel)", guidesX[1], guidesY[4]);
    ctx.font = "11px Arial";
    ctx.fillText("INTRO Shannon Peckham", guidesX[1], guidesY[5]);
    ctx.fillText("TEXT Ashley Heath", guidesX[1], guidesY[6]);
}

function setupText() {
    var longtext = "TEXT Ashley Heath";
    var paragraph = new ParagraphText(0, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "The studiously unkempt photographer with the soft German accent is unrepentant. His last, fantastic collection of pictures, Go-Sees, has been rejected altogether by certain German booksellers, presumably on account of its cover. But the book's designers at Fuel, the London-based collective, were surely not aiming to ape Nazi iconography in their execution? This is no laughing matter, after all.";
    var paragraph = new ParagraphText(1, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "'I'm only interested in really big questions right now', states the gently spoken Teller, perched precariously in the unkempt kitchen of his considerable west London home. 'I'm interested in universal questions like: Is it possible for a photo to make you cry? With the women I photographed in the book, I really wanted to know how much they were questioning. Why do they actually want to do what they do?'";
    var paragraph = new ParagraphText(2, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "So, despite the mixed response from Baden-Baden bookshops, Juergen Telleris  Go-Sees project continues to roll. First the book, then this SHOWstudio presentation of some of the issues Juergen and his partners at Fuel will be exploring in the upcoming Go-Sees film. The concept underpinning the book and film has obviously proved stimulating to a man who once spent much of his time filling the page of monthly glossies from Vogue to W to The Face, or so he tells Ashley Heath.";
    var paragraph = new ParagraphText(3, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Juergen, the Go-Sees book was subtitled Girls Who Come Knocking On My Door. That notion obviously has a real resonance with you.";
    var paragraph = new ParagraphText(4, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Well, it was an important title. A lot of people don't know what a 'go-see' is, so one of the book's very simple aims was to explain this fashion industry practice. When you become well-known or established in the fashion world - famous even - then all the model agencies start calling you up and asking you to see their girls. I always used to turn them down.";
    var paragraph = new ParagraphText(5, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "You didn't want girls knocking on your door?";
    var paragraph = new ParagraphText(6, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "I actually used to be happier going up to the agencies' offices to find a model for a shoot. If I was doing a story for The Face or i-D, that's what I'd always do. There were a couple of reasons for this - first, I felt the models themselves were more comfortable on neutral ground. But, perhaps even more importantly, I'd have a problem with the type of models that the agencies were trying to send round to my house.";
    var paragraph = new ParagraphText(6, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "They were married?";
    var paragraph = new ParagraphText(7, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "No, they were someone else's vision of what I was after. I always wanted to see the creepy ones, the old ones...";
    var paragraph = new ParagraphText(8, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "For a future film project, right? Creepy Creeps Came Knocking At My Door.";
    var paragraph = new ParagraphText(9, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "No, these were just the models that I found interesting to photograph.";
    var paragraph = new ParagraphText(10, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Alright, more seriously, Juergen. Among fashion photographers there's this constant desire to discover the 'new face'. Was the original starting point for Go-Sees just you reacting to that? Were you seeking to promote some democracy?";
    var paragraph = new ParagraphText(11, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "The democracy of the book is crucial, for me. You know, everyone asks me 'Did you find a great girl when you were taking those 462 pictures over the year?' The question is actually pretty inappropriate to the project. The whole point was that I was trying to find something to like about these women - whether they were bubbly or flirtatious or sad.";
    var paragraph = new ParagraphText(12, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "But many people in fashion can't see beyond the narrow confines of their working existence. Further, this sort of project will provoke inappropriate commentary - and that's part of the beauty of it for me. I respond to your Go-Sees work on two completely different levels. And one level is, if Amber Valletta came knocking at my door, would I bother asking 'Do you dream of yourself as an image, Amber?'";
    var paragraph = new ParagraphText(13, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Or is it possible to remain unmoved by an image of yourself?";
    var paragraph = new ParagraphText(14, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Exactly. Even if I delivered it in that seductive German accent.";
    var paragraph = new ParagraphText(15, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Remember that my starting point for Go-Sees was an attempt to re-humanise not de-humanise these models. So, maybe responding to one particular model because she is particularly sexy is a good thing.";
    var paragraph = new ParagraphText(16, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Of course it is. It's so bogus to deny that side of things.";
    var paragraph = new ParagraphText(17, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "You know, I used to look through model portfolios and I couldn't ever remember them afterwards. The pictures of them stripped away all their real character. So, when I did first let model agencies start to send models round to my studio, I would quickly photograph them as they arrived in order to create a reference card of my own. The fact is, these women often looked much better in my reference snapshots than they did in the portfolios they were inevitably clutching. That was the original starting point of the Go-Sees book.";
    var paragraph = new ParagraphText(18, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "A couple of succinct questions for you to answer. Did the desire for fame and fortune in any of these women actually repulse you?";
    var paragraph = new ParagraphText(19, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Well, obviously some models I liked less than others. And a lot were extremely keen to get the job. They were using all their energy to impress me.";
    var paragraph = new ParagraphText(20, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "And do you think some models deliberately arrived at the door trying to conform to their idea of a 'Juergen Teller model'?";
    var paragraph = new ParagraphText(21, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Yes I do. I was very aware of that.";
    var paragraph = new ParagraphText(22, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Care to expand?";
    var paragraph = new ParagraphText(23, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Well, some models would appear moody and awkward, for example, and then I'd see them somewhere else by chance and they'd look and act completely different. Some of the girls were actually honest about that process, albeit in a subtle way.";
    var paragraph = new ParagraphText(24, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "The Go-See is after all just a form of job interview.";
    var paragraph = new ParagraphText(25, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Yes, and the Go-Sees book was a collection of pictures of young women who aspire to do something as a job. There is an anthropological aspect to this project. That's something you commented on (in The Face).";
    var paragraph = new ParagraphText(26, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "And I think it's something the forthcoming film will really extend. Your contribution to show lets people in on how far you think you can extend this project now. But, coming back to that job interview point; since when did Shalom (Harlow) or Eva (Herzigova) need to turn up to a job interview to get a modeling assignment? Are you honestly hoping to convince me that these women literally turned up to your door step in the same way all those other young, unknown models did?";
    var paragraph = new ParagraphText(27, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "Well, Shalom came to see me about a job we were doing for British Vogue.";
    var paragraph = new ParagraphText(28, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "And Eva came round to see if she could borrow some sugar, right?";
    var paragraph = new ParagraphText(29, longtext, 0, true);
    paragraphs.push(paragraph);
    var longtext = "No, she asked to come and see me because she'd changed her look. She'd changed her hair colour to brown and she wanted my opinion.";
    var paragraph = new ParagraphText(30, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Tell me about it, Juergen.";
    var paragraph = new ParagraphText(31, longtext, 0, false);
    paragraphs.push(paragraph);
    var longtext = "Ashley Heath is editorial director of The Face, Arena and Pop.";
    var paragraph = new ParagraphText(32, longtext, 0, false);
    paragraphs.push(paragraph);
}

function drawText() {
    if (paragraphs.length > 0) {
        for (i = 0; i < paragraphs.length; i++) {
            var thisParagraphTop = 0;
            if (paragraphs[i].question == false) {
                ctx.font = "normal 11px Arial";
                ctx.fillStyle = '#c0c0c0';
            }
            else {
                ctx.font = "bold 11px Arial";
                ctx.fillStyle = '#dddddd';
                paragraphs[i].spaceAfter = paragraphs[i].spaceAfter / 2;
            }
            wrapText(ctx, paragraphs[i].text, guidesX[1], guidesY[7] + paragraphs[i].top - paragraphsOffsetTarget, 310, 15, i, true);
            for (j = 0; j < i; j++) {
                thisParagraphTop += paragraphs[j].height + paragraphs[j].spaceAfter;
            }
            paragraphs[i].top = thisParagraphTop;
        }
    }
}

function setupPlayers() {
    var player = new Player(0, '01.mp3', 1.95, 0, 0, 'What determines the value of a photograph ?', 1);
    players.push(player);
    var player = new Player(1, '02.mp3', 1.98, 0, 0, 'Is everything an excuse for a photograph ?', 2);
    players.push(player);
    var player = new Player(2, '03.mp3', 2.40, 0, 0, 'Do you think we learn more from questions than answers ?',3);
    players.push(player);
    var player = new Player(3, '04.mp3', 0.96, 0, 0, 'Where are you going next ?', 25);
    players.push(player);
    var player = new Player(4, '05.mp3', 1.51, 0, 0, 'Is a photograph a commodity?', 0);
    players.push(player);
    var player = new Player(5, '06.mp3', 2.79, 0, 0, 'Do you think that photography begins or ends where world starts?', 25);
    players.push(player);
    var player = new Player(6, '07.mp3', 2.1, 0, 0, 'Do you think that photography is democratic?', 4,5);
    players.push(player);
    var player = new Player(7, '08.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(8, '09.mp3', 2.5, 0, 0, 'How many ways are there of photographing the same object?', 29);
    players.push(player);
    var player = new Player(9, '10.mp3', 2.19, 0, 0, 'What qualities are you looking for in a photograph?', 9);
    players.push(player);
    var player = new Player(10, '11.mp3', 2.4, 0, 0, 'Is a bad photograph an unbelievable photograph?', 11);
    players.push(player);
    var player = new Player(11, '12.mp3', 2.4, 0, 0, 'Is it possible to remain unmoved by a photograph?', 3);
    players.push(player);
    var player = new Player(12, '13.mp3', 2.06, 0, 0, 'Is there a photograph you regret having taken?', 9);
    players.push(player);
    var player = new Player(13, '14.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(14, '15.mp3', 1.2, 0, 0, 'What do you like to photograph?', 8,9,10);
    players.push(player);
    var player = new Player(15, '16.mp3', 0.8, 0, 0, 'Do you own a camera?', 12,14,6);
    players.push(player);
    var player = new Player(16, '17.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(17, '18.mp3', 2.4, 0, 0, 'Are you sometimes frightened of what a camera might do to you?', 24);
    players.push(player);
    var player = new Player(18, '19.mp3', 1.9, 0, 0, 'Would you describe yourself as a curious person?', 17);
    players.push(player);
    var player = new Player(19, '20.mp3', 2.8, 0, 0, 'Do you think people view themselves through their likes or dislikes?', 18);
    players.push(player);
    var player = new Player(20, '21.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(21, '22.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(22, '23.mp3', 2.1, 0, 0, 'Do you always recognize yourself in a photograph?', 19);
    players.push(player);
    var player = new Player(23, '24.mp3', 1.8, 0, 0, 'Do you ever dream of yourself as an image?', 26);
    players.push(player);
    var player = new Player(24, '25.mp3', 1.5, 0, 0, 'Who would you most like to be?', 22,23);
    players.push(player);
    var player = new Player(25, '26.mp3', 0.9, 0, 0, 'How did you get here?', 15,24);
    players.push(player);
    var player = new Player(26, '27.mp3', 2.8, 0, 0, 'When you think of a photographer, do you always think of a man?', 17);
    players.push(player);
    var player = new Player(27, '28.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(28, '29.mp3', 0, 0, 0, '');
    players.push(player);
    var player = new Player(29, '30.mp3', 2.1, 0, 0, 'Are some objects more photographic than others?', 14);
    players.push(player);
    for (i = 0; i < playersCols.length; i++) {
        for (j = 0; j < playersCols[i]; j++) {
            if (i <= 0) {
                var idtoget = j;
            }
            else if (i == 1) {
                var idtoget = j + playersCols[i - 1];
            }
            else {
                var idtoget = j + playersCols[i - 1] + playersCols[i - 2];
            }
            if (players[idtoget] === undefined) {}
            else {
                players[idtoget].x = i * playerWidth;
                players[idtoget].y = j * playerHeight + playersTopY;
                if (players[idtoget].menu.length > 0) {
                    for (k = 0; k < players[idtoget].menu.length; k++) {
                        var btn1 = new Btn(0, 0, 0, 0, 'playerlink');
                        players[idtoget].btns.push(btn1);
                    }
                }
            }
        }
    }
    /*** which player is visible first ***/
    players[25].visible = true;
}

function setupInteractive() {
    var longtext = "A 'go-see' is a particular kind of vetting process in the fashion industry. Unlike a 'casting', the go-see is conducted without the prospect of a definite commission. As an open-ended yet structured encounter between the photographer and his subject, the stakes are nevertheless high, and the expectations intense. This is a model's testing ground, a trial of sorts, with the proviso that neither photographer nor model, who is also known as a go-see, is working to meet the requirements of a specific assignment.";
    var paragraph = new ParagraphText(0, longtext, 0, false);
    paragraphsInteractive.push(paragraph);
    var longtext = "Shannon Peckham";
    var paragraph = new ParagraphText(1, longtext, 0, false);
    paragraphsInteractive.push(paragraph);
    var longtext = "Click to continue";
    var paragraph = new ParagraphText(2, longtext, 0, false);
    paragraphsInteractive.push(paragraph);
    setupPlayers();
}

function drawInteractiveText() {
    if (paragraphsInteractive.length > 0) {
        for (i = 0; i < paragraphsInteractive.length; i++) {
            var thisParagraphTop = 0;
            paragraphsInteractive[i].spaceAfter = 0;
            if (i == 1) {
                paragraphsInteractive[i].spaceAfter = 15;
            }
            ctx.font = "normal 11px Arial";
            ctx.fillStyle = '#ddd';
            wrapText(ctx, paragraphsInteractive[i].text, guidesX[0], guidesY[8] + paragraphsInteractive[i].top, 435, 15, i, false);
            for (j = 0; j < i; j++) {
                thisParagraphTop += paragraphsInteractive[j].height + paragraphsInteractive[j].spaceAfter;
            }
            paragraphsInteractive[i].top = thisParagraphTop;
        }
    }
}

function drawPlayers() {
    var imageObj = new Image();
    imageObj.src = projectBasePath + 'assets/player.png';
    var barsrc = new Image();
    barsrc.src = projectBasePath + 'assets/bar.png';
    var btnmenu = new Image();
    btnmenu.src = projectBasePath + 'assets/menubtnpressed.png';
    for (i = 0; i < players.length; i++) {
        if (players[i].visible == true) {
            drawAPlayer(i, imageObj, barsrc, btnmenu);
        }
    }
}

function drawAPlayer(id, imgsrc, barsrc, btnmenusrc) {
    ctx.globalAlpha = players[id].alphanow;
    ctx.drawImage(imgsrc, players[id].x, players[id].y);
    ctx.drawImage(barsrc, players[id].x + 38 + players[id].barpos, players[id].y + 14);
    players[id].openMenuBtn.x = players[id].x + 166;
    players[id].openMenuBtn.y = players[id].y + 13;
    players[id].openMenuBtn.width = 17;
    players[id].openMenuBtn.height = 17;
    players[id].playBtn.x = players[id].x + 22;
    players[id].playBtn.y = players[id].y + 13;
    players[id].playBtn.width = 17;
    players[id].playBtn.height = 17;
    // menu opened
    if (players[id].opened == true) {
        if (players[id].menu.length > 0) {
            var rectMenuHeight = 11 * players[id].menu.length;
            players[id].openMenuBtn.x = players[id].x + 166;
            players[id].openMenuBtn.y = players[id].y + 13;
            players[id].openMenuBtn.width = 17;
            players[id].openMenuBtn.height = players[id].y + 17;
            ctx.drawImage(btnmenusrc, players[id].x + 166, players[id].y + 13);
            ctx.fillStyle = "#000000";
            ctx.fillRect(players[id].x + players[id].width + 2, players[id].y + players[id].height + 2, 77, rectMenuHeight);
            ctx.fillStyle = "#cccccc";
            ctx.fillRect(players[id].x + players[id].width, players[id].y + players[id].height, 77, rectMenuHeight);
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "#000";
            ctx.rect(players[id].x + players[id].width, players[id].y + players[id].height, 77, rectMenuHeight);
            ctx.stroke();
            for (j = 0; j < players[id].menu.length; j++) {
                var nextPlayerId = players[id].menu[j];
                var menuLineX = players[id].x + players[id].width + 4;
                var menuLineY = players[id].y + players[id].height + 4 + (j * 10);
                if (players[id].btns[j].hover == true) {
                    ctx.fillStyle = "#000";
                    ctx.fillRect(menuLineX - 2, menuLineY - 2, 73, 10);
                    ctx.font = '9px Arial';
                    ctx.fillStyle = "#fff";
                }
                else {
                    ctx.font = '9px Arial';
                    ctx.fillStyle = "#000";
                }
                ctx.fillText(players[nextPlayerId].fulltext.substr(0, 13) + '...', menuLineX, menuLineY);
                players[id].btns[j].x = menuLineX - 4;
                players[id].btns[j].y = menuLineY - 2;
                players[id].btns[j].width = 77;
                players[id].btns[j].height = 10;
                players[id].btns[j].playerid = nextPlayerId;
            }
        }
    }
    // playing
    if (players[id].audiosrc.currentTime > 0 && players[id].audiosrc.ended == false) {
        players[id].barpos = map_range(players[id].audiosrc.currentTime, 0, players[id].duration, 0, 83);
        ctx.drawImage(btnmenusrc, players[id].x + 22, players[id].y + 13);
    }
    else if (players[id].audiosrc.ended == true) {
        players[id].barpos = map_range(players[id].duration, 0, players[id].duration, 0, 83)
        players[id].playing = false;
    }
    else {
        players[id].barpos = 0;
    }
    ctx.globalAlpha = 1.0;
    ctx.font = '9px Arial';
    ctx.fillStyle = "rgba(0,0,0," + players[id].alphanow + ")";
    ctx.fillText(players[id].fulltext.substr(0, 22) + '...', players[id].x + 36, players[id].y + 4);
}

function wrapText(context, text, x, y, maxWidth, lineHeight, id, itw) {
    var words = text.split(' ')
        , line = ''
        , lineCount = 0
        , i, test, metrics, height;
    for (i = 0; i < words.length; i++) {
        test = words[i];
        metrics = context.measureText(test);
        while (metrics.width > maxWidth) {
            // Determine how much of the word will fit
            test = test.substring(0, test.length - 1);
            metrics = context.measureText(test);
        }
        if (words[i] != test) {
            words.splice(i + 1, 0, words[i].substr(test.length))
            words[i] = test;
        }
        test = line + words[i] + ' ';
        metrics = context.measureText(test);
        if (metrics.width > maxWidth && i > 0) {
            context.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
            lineCount++;
        }
        else {
            line = test;
        }
    }
    context.fillText(line, x, y);
    height = (lineCount + 1) * lineHeight;
    if (itw == true) {
        paragraphs[id].height = height;
    }
    else if (itw == false) {
        paragraphsInteractive[id].height = height;
    }
}
$('#project-interactive').click(function (e) {
    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;
    if (screens == 1 && interactiveState == 0) {
        interactiveState = 1;
    }
    for (var i = 0; i < menuItems.length; i++) {
        if (clickedX < menuItems[i].right && clickedX > menuItems[i].left && clickedY > menuItems[i].top && clickedY < menuItems[i].bottom) {
            screens = i;
            if (i == 1) {
                interactiveState = 0;
            }
        }
    }
    if (screens == 1 && interactiveState == 1) {
        for (var i = 0; i < players.length; i++) {
            if (clickedX > players[i].openMenuBtn.x && clickedX < (players[i].openMenuBtn.x + players[i].openMenuBtn.width) && clickedY > players[i].openMenuBtn.y && clickedY < (players[i].openMenuBtn.y + players[i].openMenuBtn.height) && players[i].visible == true && players[i].fadingOut == false) {
                players[i].active = true;
                if (players[i].opened == false) {
                    players[i].opened = true;
                }
                else {
                    players[i].opened = false;
                }
            }
            if (clickedX > players[i].playBtn.x && clickedX < (players[i].playBtn.x + players[i].playBtn.width) && clickedY > players[i].playBtn.y && clickedY < (players[i].playBtn.y + players[i].playBtn.height) && players[i].visible == true && players[i].fadingOut == false) {
                players[i].active = true;
                if (players[i].playing == false) {
                    players[i].playing = true;
                    players[i].audiosrc.play();
                }
                else {}
            }
            else if (players[i].visible == true && players[i].opened == true) {
                for (j = 0; j < players[i].btns.length; j++) {
                    if (clickedX > players[i].btns[j].x && clickedX < players[i].btns[j].x + players[i].btns[j].width && clickedY > players[i].btns[j].y && clickedY < players[i].btns[j].y + players[i].btns[j].height) {
                        players[i].opened = false;
                        players[i].btns[j].hover = false;
                        players[players[i].btns[j].playerid].alphanow = 1;
                        players[players[i].btns[j].playerid].visible = true;
                        players[i].fadingOut = true;
                    }
                }
            }
        }
    }
});
$("#project-interactive").mousemove(function (event) {
    var mouseX = event.pageX - this.offsetLeft;
    var mouseY = event.pageY - this.offsetTop;
    for (var i = 0; i < menuItems.length; i++) {
        if (mouseX < menuItems[i].right && mouseX > menuItems[i].left && mouseY > menuItems[i].top && mouseY < menuItems[i].bottom) {
            if (menuItems[i].opacityNow < opacityMaxMenu) {
                menuItems[i].goUp = true;
                menuItems[i].goDown = false;
            }
        }
        else {
            if (menuItems[i].opacityNow > opacityMinMenu) {
                menuItems[i].goUp = false;
                menuItems[i].goDown = true;
            }
        }
    }
    if (screens == 2 && mouseY > 40) {
        paragraphsOffsetTarget = map_range(mouseY, 40, projHeight, 0, paragraphs[paragraphs.length - 1].top + paragraphs[paragraphs.length - 1].height - projHeight / 2.3);
    }
    if (screens == 1 && interactiveState != 0) {
        for (i = 0; i < players.length; i++) {
            if (players[i].visible == true && players[i].opened == true && players[i].btns.length > 0) {
                for (j = 0; j < players[i].btns.length; j++) {
                    if (mouseX > players[i].btns[j].x && mouseX < players[i].btns[j].x + players[i].btns[j].width && mouseY > players[i].btns[j].y && mouseY < players[i].btns[j].y + players[i].btns[j].height) {
                        players[i].btns[j].hover = true;
                    }
                    else {
                        players[i].btns[j].hover = false;
                    }
                }
            }
        }
    }
});

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
    });