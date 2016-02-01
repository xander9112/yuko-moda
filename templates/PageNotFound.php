<?php
$url_prefix = '';
$imageFolder = '/data/images/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>5 element</title>
	<link rel="stylesheet" type="text/css" href="<?=$url_prefix?>/site/assets/css/style.css">
</head>
<body>
	<div class="b-page-not-found js-page-not-found"
		 data-sources='[ "<?=$imageFolder?>02.gif", "<?=$imageFolder?>03.gif", "<?=$imageFolder?>07.gif" ]'
		 style="background-image: url(<?=$imageFolder?>02.gif)">
		<div class="overlay"></div>
		<div class="logo-wrapper">
			<a class="logo" href="/">
				<span class="g-icon g-icon-logo logo-image"></span>
				<span class="company-name">
					Пятый
					элемент
				</span>
			</a>
			<p class="description">
				Инженерно
				технические
				средства
				безопасности
			</p>
		</div>
		<p class="text">
			К сожалению, такой страницы больше нет.
			Быть может, её никогда не существовало
			или неправильно введён адрес.
		</p>
		<p class="text">
			Наверняка, <a class="link" href="/">камера видеонаблюдения</a> смогла бы что-то
			прояснить или <a class="link" href="/">охранно-пожарная сигнализация</a> о
			чём-то предупредить.
		</p>
		<p class="text">
			Попробуйте вернуться на <a class="link" href="/">главную страницу</a>
			или воспользоваться поиском:
		</p>
		<div class="input-wrapper">
			<input type="search" class="search-input" placeholder="Найти">
			<span class="g-icon g-icon-search search-icon"></span>
		</div>
		<a class="help-link js-who-is" href="/">Кто ещё мог быть в этом замешан?</a>
	</div>
	<script src="<?=$url_prefix?>/site/assets/js/vendor-bundle.js"></script>
	<script src="<?=$url_prefix?>/site/assets/js/app.js"></script>
</body>
</html>
