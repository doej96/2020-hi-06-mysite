/********* 전역선언 **********/
var scTop, topHeight, logoHeight, winWidth, navi = [];

/********* 사용자함수 **********/
function renderPrd() {
	$(".prd").each(function(i){
		var discount = $(this).data('discount');
		var icon = $(this).data('icon');
		if(discount) {
			$(this).find('.icon-wrap').append('<div class="discount>'+discount+'</div>');
		}
		if(icon && icon.length > 0) { /* 앞의 조건을 먼저 검사 */
			for(var i=0; i<icon.length; i++) {
				$(this).find('.icon-wrap').append('<div class="icon" style="background-color: '+icon[i].bg+';">'+icon[i].title+'</div>')
			}
		}
	})
}

function chgImg(el, src) {
	$(el).parents('.prd').find('.img-front').attr({"src":src});
	$(el).parents('.choice').addClass('active').siblings().removeClass('active');
}

function renderStar() {
	$(".star").each(function(i){
	var score =Number($(this).data('score'));
	if(score > 0) $(this).find("i").addClass("active");
	$(this).find(".mask").css("left", score * 20 + "%");
	})
}

function mainBanner() {
	var swiper = new Swiper('.main-wrapper.swiper-container', {
		slidesPerView: 1,
		loop: 'true',
		effect: 'fade',
		autoplay: {
			delay : 4000,
			},
		pagination: {
			el: '.main-wrapper .pager-wrap',
			clickable: 'true',
		},
			navigation: {
			nextEl: '.main-wrapper .bt-next',
			prevEl: '.main-wrapper .bt-prev',
		},
	});
}

function createNavi(r) {
	var html = '<a href="'+r.link+'" class="hover-line">';
	if(r.icon) html += '<i class="'+r.icon+'"></i>';
	html += r.name;
	html += '</a>';
	return html;
}

function createSub(r) { //r=데이터
	var html = '<div class="sub-navi-wrap">'
	for(var i=0; i<r.depth2.length; i++) { //배열은 length를 가짐
		if (r.depth2[i].depth3 && i>0) {
			html += '</div><div class="sub-navi-wrap">'  //앞에 있는 div닫고 새로 단독으로 div 엶
		} //먼저 div생성하고 나서 그 뒤에 집어넣어야 
		html += '<a href="'+r.depth2[i].link+'" class="sub-navi bold">'+r.depth2[i].name+'</a>';
		if(r.depth2[i].depth3) {
			for(var j=0; j<r.depth2[i].depth3.length; j++) {
				html += '<a href="'+r.depth2[i].depth3[j].link+'" class="sub-navi hover-line">'+r.depth2[i].depth3[j].name+'</a>';
			}
		}
	}
	html += '</div>';
	return html;
}

function createSub2(r) {
	for(var i=0, html=''; i<r.depth2.length; i++) {
	html += '<li class="depth depth2">';
	html += 	'<a href="'+r.depth2[i].link+'">'+r.depth2[i].name+'</a>';
	if(r.depth2[i].depth3 && r.depth2[i].depth3.length > 0) {
		html += 	'<ul>';
		for(var j=0; j<r.depth2[i].depth3.length; j++) {
			html += '		<li class="depth3 depth"><a href="'+r.depth2[i].depth3[j].link+'">'+r.depth2[i].depth3[j].name+'</a></li>';
		}
	 	html += '	</ul>';
	}
	html += '</li>';
	}
	return html;
}

function createSubNavi(el, r) { //el:DOM
	$(el).prepend(createNavi(r))
	$(el).find('.sub-wrapper2').append(createSub2(r));
	$(el).mouseenter(onSub2Enter);
	$(el).mouseleave(onSub2Leave);
	$(el).find('.depth2').mouseenter(onDepth2Enter);
	$(el).find('.depth2').mouseleave(onDepth2Leave);
}

function naviShowHide() {
	if(winWidth >= 1199) {
		if(scTop >= topHeight + logoHeight){
			$(".navi-wrapper").css({position: "fixed"});
			$(".navi-wrapper > .wrapper").css("max-width", "100%");
			$(".navi-wrapper .navi-logo").css("display", "block");
			$(".navi-wrapper .bt-login").css("display", "block");
		}else {
			$(".navi-wrapper").css({position: "relative"});
			$(".navi-wrapper > .wrapper").css("max-width","1200px");
			$(".navi-wrapper .navi-logo").css("display", "none");
			$(".navi-wrapper .bt-login").css("display", "none");
		}
		$(".logo-wrapper").css({position: "relative"});
	}
	else{
		if(scTop >= topHeight)
		$(".logo-wrapper").css({position: "fixed"});
		 else 
			$(".logo-wrapper").css({position: "relative"});
			$(".navi-wrapper").css({position: "relative"});
	}
}

function createMoNavi() {
		var html = '';
	  html += '<div class="top-wrap">';
		html += '<div class="close-wrap3 bt-close" onclick="onModalHide()">';
		html += '<i class="fa fa-times"></i>';
		html += '</div>';
		html += '<div class="tel-wrap">Available 24/7 at <strong>(018) 900-6690</strong></div>';
		html += '</div>';
		html += '<ul>';
		var i;
	for(var i in navi) {
		html += '<li onclick="createDepth2('+i+');">';
		html += '<a href="#">'+navi[i].name+'</a>';
		html += '<i class="fa fa-angle-right"></i>';
		html += '</li>';
	}
		html += '</ul>';
	$(".modal-navi").find(".depth1").html(html);
	$(".modal-navi").find(".depth1").append($(".trans-wrapper").clone().attr("style","")).find('.trans-bg').remove();
	$(".modal-navi").find(".depth1").find('.trans-wrapper .bt-down').click(onLangSel);

	$(".modal-navi .depth2, .modal-navi .depth3").removeClass('active'); //depth2,depth3에서 닫아도 열 때 depth1 나오게 함
}

function createDepth2(idx) {
	html = '<div class="top-wrap">';
	html += '<div class="close-wrap3 bt-prev" onclick="closeDepth(2)">';
	html += '<i class="fa fa-angle-left"></i>';
	html += '</div>';
	html += '<h4 class="title">'+navi[idx].name+'</h4>';
	html += '</div>';
	html += '<ul>';
	for (var i=0; i<navi[idx].depth2.length; i++) {
		if(navi[idx].depth2[i].depth3 && navi[idx].depth2[i].depth3.length > 0) {
		html += '<li onclick="createDepth3('+idx+','+i+');">';
		html += '<a href="#">'+navi[idx].depth2[i].name+'</a>';
		html += '<i class="fa fa-angle-right"></i>';
		html += '</li>';
		}
		else{
		html += '<li>';
		html += '<a href="#">'+navi[idx].depth2[i].name+'</a>';
		html += '</li>';
		}
	}
	html += '</ul>';
	$(".modal-navi .depth2").html(html);
	$(".modal-navi .depth2").addClass('active');
}

function createDepth3(idx, idx2) {
	html = '<div class="top-wrap">';
	html += '<div class="close-wrap3 bt-prev" onclick="closeDepth(3)">';
	html += '<i class="fa fa-angle-left"></i>';
	html += '</div>';
	html += '<h4 class="title">'+navi[idx].depth2[idx2].name+'</h4>';
	html += '</div>';
	html += '<ul>';
	for (var i=0; i<navi[idx].depth2[idx2].depth3.length; i++) {
		html += '<li>';
		html += '<a href="#">'+navi[idx].depth2[idx2].depth3[i].name+'</a>';
		html += '</li>';
	}
	html += '</ul>';
	$(".modal-navi .depth3").html(html);
	$(".modal-navi .depth3").addClass('active');
}


function closeDepth(n) { //
	$(".modal-navi .depth"+n).removeClass('active');
}

/********* 이벤트선언 **********/
mainBanner();

$(window).scroll(onScroll); //scroll spy
$(window).resize(onResize).trigger("resize"); //휠은 휠로만 생김

$('.top-wrapper .icon-down').click(onLangChg); // 언어선택
$('.top-wrapper .bt-down').click(onLangSel); // 언어선택
$('.trans-wrapper .trans-bg').click(onTransBg); // trans창 닫기
$('.trans-wrapper .lang').click(onLangClick); // flag-now, lang-now 선택

$.get('../json/navi-new.json', onNaviNew); // new releases 생성
$.get('../json/navi-best.json', onNaviBest); // best sellers 생성
$.get('../json/navi-sales.json', onNaviSales); // sales 생성
$.get('../json/navi-men.json', onNaviMen); // Men 상품 가져오기
$.get('../json/navi-women.json', onNaviWomen); // Women 상품 가져오기
$.get('../json/navi-kids.json', onNaviKids); // Kids 상품 가져오기

$.get('../json/new-products.json', onNewProducts); // new releases 상품 가져오기

$.get('../json/looking.json', onLooking); //Looking 생성

$.get('../json/prd.json', onPrd); // Prd배너 생성

$(".navi-wrapper .navi").mouseenter(onNaviEnter);
//mobile은 mouseover가 없기 때문에 가급적이면 주지 말기
//mouseenter는 pc에서 hover, 모바일에서는 touch
$(".navi-wrapper .navi").mouseleave(onNaviLeave);

$(".modal-trigger").click(onModalShow);
$(".modal-container").click(onModalHide);
$('.modal-wrapper').click(onModalWrapperClick);
$('.modal-wrapper').find(".bt-close").click(onModalHide);

renderStar();
renderPrd();


/********* 이벤트콜백 **********/

//append를 for문 안에 넣을 때는 겹치지않도록 html += ''이 아니라 (for문 안에서)html=''으로 시작
//append를 바깥에다 넣을 때는 for문 다 돌고 붙이는 것이므로 html+=''으로 시작
function onPrd(r) {
	for(var i=0, html=''; i<r.length; i++) {
		html = '<li class="prd swiper-slide" ';
		 // if(r[i].discount) html+= 'data-discount="'+r[i].discount+'"';
		 html+= 'data-discount="'+(r[i].discount || '')+'" ';
		 html+= 'data-icon=\'['
		 if(r[i].icon && r[i].icon.length > 0) {
			 for(var j=0; j<r[i].icon.length; j++) {
			html += '{"title": "'+r[i].icon[j].title+'", "bg": "'+r[i].icon[j].bg+'"},';
		 }
		 html = html.slice(0, -1); //html에서 뒤에서 한자리 잘라내기
	}
		html += ']\'>';
		html += '<div class="icon-wrap"></div>';
		html += '<div class="quick-wrap">';
		html += '<i class="fa fa-eye"></i>';
		html += '<span>Quick View</span>';
		html += '</div>';
		html += '<div class="img-wrap">';
		html += '<img src="'+r[i].imgFront[0].big+'" alt="사진" class="w-100 img-front">';
		html += '<img src="../img/pic2.jpg" alt="사진" class="w-100">';
		html += '<a href="#" class="bt-white">ADD CART</a>';
		html += '</div>';
		html += '<div class="title-wrap">';
		html += '<div class="title">'+r[i].title+'</div>';
		html += '<i class="bt-like far fa-heart" onclick="$(this).addClass(\'fa\').removeClass(\'far\');"></i>';
		html += '</div>';
		html += '<ul class="choice-wrap">';
		for(var j=0; j<r[i].imgFront.length; j++) {
			html += '<li class="choice '+(j == 0 ? 'active':'')+'">';
			html += '<img src="'+r[i].imgFront[j].thumb+'" alt="thumb" class="w-100" onclick="chgImg(this, \''+r[i].imgFront[j].big+'\');">';
			html += '</li>';
		}
		html += '</ul>';
		html += '<div class="content-wrap">';
		html += '<span class="content hover-line">'+r[i].content+'</span>';
		html += '<span> - </span>';
		html += '<span class="color hover-line">'+r[i].color+'</span>';
		html += '</div>';
		html += '<div class="price-wrap">'+r[i].price+'</div>';
		html += '<div class="star-wrap">';
		html += '<div class="star" data-score="'+r[i].star+'">';
		for(var j=0; j<5; j++) html += '<i class="fa fa-star"></i>';
		html += '<div class="mask"></div>';
		html += '</div>';
		html += '<a href="'+r[i].link+'" class="bt-more">MORE SIZES ABAILABLE</a>';
		html += '</div>';
		html += '</li>';
		$(".prd-wrap").append(html);
	}
	renderStar();
	renderPrd();
	var swiper = new Swiper('.prd-wrapper.swiper-container',{
			slidesPerView: 1,
			loop: true,
			navigation: {
				nextEl: '.main-wrapper .bt-next',
				prevEl: '.main-wrapper .bt-prev',
			},
			breakpoints: {
        576: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3
        },
        992: {
          slidesPerView: 4
        },
      }
	});

}

function onLooking(r){
	for(var i=0, html=''; i<r.length; i++) {
		html += '<li class="spot">';
		html += '<a href="'+r[i].link+'">';
		html += '<img src="'+r[i].src+'" class="w-100 animate__animated">';
		html += '<h3 class="title hover-line">'+r[i].title+'</h3>';
		html += '</a>';
		html += '</li>';
	}
	$(".looking-wrapper .spot-wrapper").html(html);
}

function onTransBg(e) {
	e.stopPropagation();
	onLangChg();
}

function onModalWrapperClick(e) {
	e.stopPropagation();
}

function onModalShow(e) {
	e.preventDefault(); //디폴트액션, 기본이벤트(a태그로 #가는 것) 막음
	$(".modal-container").css({"display":"block"});
	$(".modal-container").css("opacity");
	//displaly:none돼서 속성 다 무시되고 opacity 초기값 없이 active클래스만 먹음, 따라서 다시 opacity값 불러줘야
	$(".modal-container").addClass('active');
	$("body").addClass("hide"); //스크롤 안먹음
	$($(this).data('modal')).addClass("active");

	if($(this).data("modal") === '.modal-navi') createMoNavi();
}

function onModalHide() {
	$(".modal-container").removeClass('active');
	$('.modal-wrapper').removeClass("active");
	setTimeout(function(){
		$(".modal-container").css({"display":"none"});
		$("body").removeClass("hide");
	}, 300); //0.3초 뒤에 적용됨
}

function onResize(e) {
	topHeight = $('.top-wrapper').outerHeight();
	logoHeight = $('.logo-wrapper').outerHeight();
	winWidth = $(window).width();
	/* naviTop = $(".navi-wrapper").offset().top; */
	//naviTop값 스크롤할 때마다 찾는 게 아니라 resize(브라우저 크기 바뀔때마다)찾음
	if(winWidth <1200) $(".top-wrapper .trans-wrapper").hide();
}

function onScroll(e) {
	scTop = $(this).scrollTop();
	// navi-wrapper fixed
	//offset : 얼마나 떨어져있는지, 폭을 구해줌, 객체로 나옴({top:129, left:0}), 따라서 이 객체의 top을 구하면 됨
	naviShowHide();
	/* 
	if(scTop >= naviTop) {
		$(".navi-wrapper").css({position: "fixed", width: "100%", top:"0"});
	}else {
		$(".navi-wrapper").css({position: "relative"});
	}
	console.log(scTop); */ //브라우저 맨 위 좌표값?? scTop0이면 맨 위
}

function onSub2Enter() {
	$(this).find('.sub-wrapper2').stop().slideDown(300);
}
function onSub2Leave() {
	$(this).find('.sub-wrapper2').stop().slideUp(300);
}

function onDepth2Enter() {
	$(this).find('ul').stop().fadeIn(300);
}
function onDepth2Leave() {
	$(this).find('ul').stop().fadeOut(300);
}


function onNaviMen(r) {
	navi[2]=r;
	createSubNavi('.navi.navi-men',r);
}

function onNaviWomen(r) {
	navi[3]=r;
	createSubNavi(".navi.navi-women",r);
}

function onNaviKids(r) {
	navi[4]=r;
	createSubNavi(".navi.navi-kids",r);
}

function onNaviEnter() {
	$(this).find(".sub-wrapper").addClass('active');
}

function onNaviLeave() {
	$(this).find(".sub-wrapper").removeClass('active');
}

function onNaviNew(r) {
	navi[0]=r;
	$(".navi.navi-new").prepend(createNavi(r));
	var html = createSub(r);
	html += '<div class="sub-banner">';
	html += 	'<img src="../img/trend0.jpg" alt="" class="mw-100">';
	html += '</div>';
	$(".navi.navi-new").find(".sub-navi-wrapper").append(html);
}

function onNaviBest(r) {
	navi[1]=r;
	$(".navi.navi-best").prepend(createNavi(r));
	$(".navi.navi-best").find(".sub-navi-wrapper").append(createSub(r));

	for(var i=0; i<r.alphabet.length; i++) {
		if(r.alphabet[i].class == '')
		html = '<li><a>'+r.alphabet[i].name+'</a></li>';
		else
		html = '<li><a href="#" class="'+r.alphabet[i].class+'">'+r.alphabet[i].name+'</a></li>'
		$(".navi.navi-best").find(".alphabet-wrap").append(html);
	}
}

function onNaviSales(r) {
	navi[5]=r;
	$(".navi.navi-sales").prepend(createNavi(r));
	for(var i=0; i<r.depth2.length; i++) {
	html = '<div class="brand-wrap">';
	html += '<div class="img-wrap" style="background-image: url('+r.depth2[i].src+'); order:'+i%2+'"></div>';
	//나누기 구하는 연산자 : '%', 다른 아이템이 초기값(0)이고 해당 아이템이 order=1이면 가장 마지막에
	html += '<ul class="brand-link">';
	html += '	<li class="sub-navi bold">'+r.depth2[i].name+'</li>';
	for(var j=0; j<r.depth2[i].depth3.length; j++) {
		html += '<li class="sub-navi hover-line">';
		html += '<a href="'+r.depth2[i].depth3[j].link+'">'+r.depth2[i].depth3[j].name+'</a>';
		html += '</li>';
	}
	html += '</ul>';
	html += '</div>';
	$(".navi.navi-sales").find(".sales-wrapper").append(html);
	}
}

function onNewProducts(r) {
	for(var i=0, html='', $slide; i<r.length; i++) {
		html  = '<div class="slide swiper-slide">';
		html += '<div class="img-wrap">';
		html += '<img src="'+r[i].src+'" alt="상품" class="w-100">';
		html += '</div>';
		html += '<div class="content-wrap">';
		html += '<h4 class="title">'+r[i].title+'</h4>';
		html += '<p class="summary">'+r[i].summary+'</p>';
		html += '<div class="star" data-score="'+r[i].star+'">';
		for(var j=0; j<5; j++) html += '<i class="fa fa-star"></i>';
		if(Number(r[i].star) > 0) html += '<div class="mask"></div>';
		html += '</div>';
		html += '<div class="content">';
		html += '<span class="price-original">$'+r[i].originalPrice+'</span>';
		html += '<span> | </span>';
		html += '<span class="origin">'+r[i].origin+'</span>';
		html += '</div>';
		html += '<div class="price-sale">$'+r[i].salePrice+'</div>';
		html += '</div>';
		html += '</div>';
		$slide = $(html).appendTo(".navi-new .swiper-wrapper");
		renderStar();
	}
	var swiper = new Swiper('#newSlide .swiper-container', {
			slidesPerView: 4,
			loop: true,
			autoplay : {
				delay : 5000,
			},
			navigation: {
				nextEl: '#newSlide .bt-next',
				prevEl: '#newSlide .bt-prev',
			},
	});
}

function onLangChg() {
	$(".trans-wrapper").stop().slideToggle(200);
	$(".trans-wrapper .lang-sel").stop().slideUp(200);
}
function onLangSel() {
	$(".trans-wrapper .lang-sel").stop().slideUp(200);
	if($(this).next().css("display") === 'none') $(this).next().stop().slideDown(200);
}
function onLangClick() {
	var $container = $(this).parent().parent().parent();
	var lang = $(this).text();
	var bg = $(this).prev().css("background-image");
	$container.find('lang').removeClass('active');
	$(this).addClass('active');
	$container.find('.flag-now').css("background-image", bg);
	$container.find('.lang-now').text(lang);
	$(this).parent().parent().stop().slideUp(200);
}

