<?
$slider = $db->selectAll("slider");
$catalog = $db->selectAll("catalog");
$catalog2 = $db->selectAll("catalog2");
$catalog3 = $db->selectAll("catalog3");
?>

<div class="row">
    <div class="col-md-12">
        <div class="b-main-slider js-main-slider">
            <div class="left-button js-backward-button">
                <span class="g-icon g-icon-big-arrow-left navigate-icon left"></span>
            </div>
            <div class="right-button js-forward-button">
                <span class="g-icon g-icon-big-arrow-right navigate-icon right"></span>
            </div>
            <div class="pages js-pages">
                <div class="page active js-page"></div>
                <div class="page js-page"></div>
                <div class="page js-page"></div>
            </div>
            <div class="outer js-inner">
                <div class="items js-items">
                    <? foreach ($slider as $slide) { ?>
                        <div class="item js-item">
                            <div class="inner">
                                <h3 class="slider-header">
                                    <?= $slide['title']['value'] ?>
                                </h3>

                                <p class="slider-text">
                                    <?= $slide['about']['value'] ?>
                                </p>
                                <a class="link" href="<?= $slide['link']['value'] ?>">
                                    <span class="link-content">Подробнее</span>
                                    <span class="g-icon g-icon-arrow-long-right icon-next"></span>
                                </a>
                                <img class="image" src="<?= $imageFolder . $slide['image']['value']; ?>" alt="">
                            </div>
                        </div>
                    <? } ?>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row b-product-cards">
    <div class="col-md-12 b-headers-list">
        <a class="item current" href="/">Хиты продаж</a>
        <a class="item dashed" href="/">Специальные предложения</a>
        <a class="item small" href="/catalogpage">Весь каталог</a>
    </div>
    <div class="col-md-12 cards-wrapper js-slider">
        <div class="left-button js-backward-button">
            <span class="g-icon g-icon-small-arrow-left navigate-icon"></span>
        </div>
        <div class="right-button js-forward-button">
            <span class="g-icon g-icon-small-arrow-right navigate-icon"></span>
        </div>
        <div class="inner js-inner">
            <div class="cards js-items">
                <? foreach ($catalog as $item) { ?>
                    <div class="card js-item" data-id="<?= $item['id']['value'] ?>">
                        <a class="product-link" href="/">
                            <div class="marker">Хит</div>
                            <div class="image-wrapper">
                                <img class="image" src="<?= $imageFolder . $item['image']['value'] ?>" alt="">
                            </div>
                            <div class="link-wrapper js-overflow-ellipsis">
                                <span class="text">
                                    <?= $item['title']['value'] ?>
                                </span>
                            </div>
                        </a>
                        <p class="price-wrapper">
                            <span class="price">
                                <?= $item['price']['value'] ?>
                            </span>
                            <span class="rub">q</span>
                            <? if ($item['oldPrice']['value'] !== "") { ?>
                                <span class="price old">
                                    <?= $item['oldPrice']['value'] ?>
						        </span>
                                <span class="rub old">q</span>
                            <? } ?>
                        </p>
						<div class="additional">
							<div class="amount">
								<div class="minus">-</div>
								<input class="number" type="text" value="1">
								<div class="plus">+</div>
							</div>
							<div class="g-button orange-red">Добавить в корзину</div>
						</div>
                    </div>
                <? } ?>
            </div>
        </div>
        <div class="progress-wrapper js-progress-wrapper">
            <div class="progress js-progress"></div>
        </div>
    </div>
</div>
<div class="row b-product-cards">
	<div class="col-md-12 b-headers-list">
		<a class="item" href="/">IP камеры</a>
		<a class="item small" href="/catalogpage">Весь каталог</a>
	</div>
	<div class="col-md-12 cards-wrapper js-slider">
		<div class="left-button js-backward-button">
			<span class="g-icon g-icon-small-arrow-left navigate-icon"></span>
		</div>
		<div class="right-button js-forward-button">
			<span class="g-icon g-icon-small-arrow-right navigate-icon"></span>
		</div>
		<div class="inner js-inner">
			<div class="cards js-items">
                <? foreach ($catalog2 as $item) { ?>
                    <div class="card js-item" data-id="<?= $item['id']['value'] ?>">
                        <a class="product-link" href="/">
                            <div class="marker">Хит</div>
                            <div class="image-wrapper">
                                <img class="image" src="<?= $imageFolder . $item['image']['value'] ?>" alt="">
                            </div>
                            <div class="link-wrapper js-overflow-ellipsis">
                                <span class="text">
                                    <?= $item['title']['value'] ?>
                                </span>
                            </div>
                        </a>
                        <p class="price-wrapper">
                            <span class="price">
                                <?= $item['price']['value'] ?>
                            </span>
                            <span class="rub">q</span>
                            <? if ($item['oldPrice']['value'] !== "") { ?>
                                <span class="price old">
                                    <?= $item['oldPrice']['value'] ?>
						        </span>
                                <span class="rub old">q</span>
                            <? } ?>
                        </p>
                        <div class="additional">
                            <div class="amount">
                                <div class="minus">-</div>
                                <input class="number" type="text" value="1">
                                <div class="plus">+</div>
                            </div>
                            <div class="g-button orange-red">Добавить в корзину</div>
                        </div>
                    </div>
                <? } ?>
            </div>
        </div>
        <div class="progress-wrapper js-progress-wrapper">
            <div class="progress js-progress"></div>
        </div>
    </div>
</div>
<div class="row b-product-cards">
	<div class="col-md-12 b-headers-list">
		<a class="item" href="/">Порошковые огнетушители</a>
	</div>
	<div class="col-md-12 cards-wrapper js-slider">
		<div class="left-button js-backward-button">
			<span class="g-icon g-icon-small-arrow-left navigate-icon"></span>
		</div>
		<div class="right-button js-forward-button">
			<span class="g-icon g-icon-small-arrow-right navigate-icon"></span>
		</div>
		<div class="inner js-inner">
			<div class="cards js-items">
                <? foreach ($catalog3 as $item) { ?>
                    <div class="card js-item" data-id="<?= $item['id']['value'] ?>">
                        <a class="product-link" href="/">
                            <div class="marker">Хит</div>
                            <div class="image-wrapper">
                                <img class="image" src="<?= $imageFolder . $item['image']['value'] ?>" alt="">
                            </div>
                            <div class="link-wrapper js-overflow-ellipsis">
                                <span class="text">
                                    <?= $item['title']['value'] ?>
                                </span>
                            </div>
                        </a>
                        <p class="price-wrapper">
                            <span class="price">
                                <?= $item['price']['value'] ?>
                            </span>
                            <span class="rub">q</span>
                            <? if ($item['oldPrice']['value'] !== "") { ?>
                                <span class="price old">
                                    <?= $item['oldPrice']['value'] ?>
						        </span>
                                <span class="rub old">q</span>
                            <? } ?>
                        </p>
                        <div class="additional">
                            <div class="amount">
                                <div class="minus">-</div>
                                <input class="number" type="text" value="1">
                                <div class="plus">+</div>
                            </div>
                            <div class="g-button orange-red">Добавить в корзину</div>
                        </div>
                    </div>
                <? } ?>
            </div>
        </div>
        <div class="progress-wrapper js-progress-wrapper">
            <div class="progress js-progress"></div>
        </div>
    </div>
</div>
<div class="row b-brands">
	<div class="col-md-12 brands-header">
		Бренды
	</div>
	<div class="row col-md-12 brands-wrapper">
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/teco.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/hikvision.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/arsbez.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/sct.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/polyision.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/trassir.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/rubezh.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/arsenal.png" alt="">
        </div>
		<div class="col-md-2 brand">
			<img class="image" src="<? echo $imageFolder; ?>logotypes/bastion.png" alt="">
		</div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/cyfron.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/osnovo.png" alt="">
        </div>
        <div class="col-md-2 brand">
            <img class="image" src="<? echo $imageFolder; ?>logotypes/rvi.png" alt="">
        </div>
		<div class="col-md-2 brand">
			<img class="image" src="<? echo $imageFolder; ?>logotypes/bolid.png" alt="">
		</div>
		<div class="col-md-2 brand">
			<img class="image" src="<? echo $imageFolder; ?>logotypes/commax.png" alt="">
		</div>
		<div class="col-md-2 brand">
			<img class="image" src="<? echo $imageFolder; ?>logotypes/alhua.png" alt="">
		</div>
	</div>
</div>

<div class="b-bottom-banners">
    <h4 class="name">Секретные элементы</h4>

    <div class="content-block">
        <div class="icon-wrapper">
            <span class="icon g-icon g-icon-pig"></span>
        </div>
        <div class="text-wrapper">
            <p class="block-name">Достойная цена</p>

            <p class="text">
                Гордостью нашей компании является ее команда, составленная из лучших профессионалов в теплотехнической
                отрасли, и мы уверены, что вы по достоинству оцените простоту и удобство работы с нашим коллективом.
            </p>
        </div>
    </div>
    <div class="content-block">
        <div class="icon-wrapper">
            <span class="icon g-icon g-icon-thumb-up"></span>
        </div>
        <div class="text-wrapper">
            <p class="block-name">Высшее качество</p>

            <p class="text">
                Гордостью нашей компании является ее команда, составленная из лучших профессионалов в теплотехнической
                отрасли, и мы уверены, что вы по достоинству оцените простоту и удобство работы с нашим коллективом.
            </p>
        </div>
    </div>
    <div class="content-block">
        <div class="icon-wrapper">
            <span class="icon g-icon g-icon-man"></span>
        </div>
        <div class="text-wrapper">
            <p class="block-name">Персональный менеджер</p>

            <p class="text">
                Гордостью нашей компании является ее команда, составленная из лучших профессионалов в теплотехнической
                отрасли, и мы уверены, что вы по достоинству оцените простоту и удобство работы с нашим коллективом.
            </p>
        </div>
    </div>
    <div class="content-block">
        <div class="icon-wrapper">
            <span class="icon g-icon g-icon-truck"></span>
        </div>
        <div class="text-wrapper">
            <p class="block-name">Аккуратная доставка</p>

            <p class="text">
                Гордостью нашей компании является ее команда, составленная из лучших профессионалов в теплотехнической
                отрасли, и мы уверены, что вы по достоинству оцените простоту и удобство работы с нашим коллективом.
            </p>
        </div>
    </div>
    <div class="content-block">
        <div class="icon-wrapper">
            <span class="icon g-icon g-icon-pliers"></span>
        </div>
        <div class="text-wrapper">
            <p class="block-name">Профессиональный монтаж </p>

            <p class="text">
                Гордостью нашей компании является ее команда, составленная из лучших профессионалов в теплотехнической
                отрасли, и мы уверены, что вы по достоинству оцените простоту и удобство работы с нашим коллективом.
            </p>
        </div>
    </div>
</div>
