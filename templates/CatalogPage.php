<?php
include('../header.php');

$catalog = $db->selectAll("catalog");
?>
<div class="row">
	<h1 class="col-md-12">Видеодомофоны</h1>
	<div class="col-md-9">
		<div class="b-headers-list">
			<div class="item">Цене</div>
			<div class="item">Популярности</div>
		</div>
		<div class="b-catalog-cards">
			<? foreach ($catalog as $item) { ?>
			<div class="row card" data-id="<?= $item['id']['value'] ?>">
				<div class="image-wrapper col-md-3">
					<div class="marker">Хит</div>
					<img class="image" src="<?= $imageFolder . $item['image']['value'] ?>" alt="">
				</div>
				<div class="common-wrapper col-md-9">
					<div class="link-wrapper">
						<a class="text" href="/">
							<?= $item['title']['value'] ?>
						</a>
					</div>
					<p class="product-description">
						поверхность эмалированная сталь; ширина — 580мм; цвет — черный
					</p>
					<p class="product-count">
						<span class="stock">Склад:</span>
						<span class="count">В наличии</span>
					</p>
					<a class="to-compare" href="/">В сравнение</a>
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
						<div class="to-cart g-button orange-red medium-size">В корзину</div>
					</div>
				</div>
			</div>
			<? } ?>
		</div>
	</div>
	<div class="col-md-3">
		<div class="b-catalog-filters">
			<form class="form">
				<input type="reset" class="clear" value="Очистить">
				<section class="elements-group first">
					<h3 class="name">Фильтры:</h3>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="has-product-catalog-page">
						<span class="real-checkbox"></span>
						<label class="label" for="has-product-catalog-page">Есть в наличии</label>
					</div>
				</section>
				<section class="elements-group">
					<h3 class="name price">Цена:</h3>
					<div class="form-group">
						<input type="text" class="input" placeholder="2 090">
						<span class="delimiter">-</span>
						<input type="text" class="input" placeholder="100 980">
					</div>
				</section>
				<section class="elements-group loud">
					<h3 class="name">Громкая связь</h3>
					<div class="form-group">
						<input type="radio" name="loud-sound" class="radio" id="loud-speech-yes-catalog-page">
						<span class="real-radio"></span>
						<label class="label" for="loud-speech-yes-catalog-page">Есть</label>
					</div>
					<div class="form-group">
						<input type="radio" name="loud-sound" class="radio" id="loud-speech-no-catalog-page">
						<span class="real-radio"></span>
						<label class="label" for="loud-speech-no-catalog-page">Нет</label>
					</div>
				</section>
				<section class="elements-group vendor">
					<h3 class="name">Производитель</h3>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-1">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-1">D-LINK</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-2">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-2">FALCON EYE</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-3">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-3">GINZZU</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-4">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-4">HIKVISION</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-5" disabled>
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-5">KGUARD</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-6">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-6">SWANN</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-7">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-7">TRENDNET</label>
					</div>
					<div class="form-group">
						<input type="checkbox" class="checkbox" id="vendor-in-catalog-page-8">
						<span class="real-checkbox"></span>
						<label class="label" for="vendor-in-catalog-page-8">ZNV</label>
					</div>
				</section>
				<div class="elements-group submit">
					<input type="submit" value="Показать" class="submit">
				</div>
			</form>
		</div>
	</div>
</div>

<?php
include('../footer.php');
