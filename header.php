<?php
require 'config.php';

$menu = $db->selectAll('catalogs');

foreach ($menu as $key => $value) {
    foreach ($value as $key => $value) { ?>
        <li><?= $key; ?>
            <? if (isset($value)) {
                if (count($value) > 0) {
                    foreach ($value as $key => $value) { ?>
                        <a><?=$value;?></a>
                        <?
                    }
                }
            }
            ?>
        </li>
    <?
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>5 element</title>
    <link rel="stylesheet" type="text/css" href="<?= $assets; ?>/css/style.css">
</head>
<body>
<div class="p-menu">
    <div class="logo-wrapper">
        <a class="logo" href="/">
            <img class="logo-image" src="<?= $assets; ?>/images/logo.svg" alt="logo">
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
    <div class="search-wrapper">
        <input class="search" type="text">

        <div class="button g-button">Поиск<span class="icon g-icon g-icon-search"></span></div>
    </div>
    <nav class="menu-wrapper">
        <?php
        $tempMenuNames = array(
            'Видеонаблюдение',
            'Видеодомофоны',
            'Охранно – пожарная сигнализация',
            'Средства пожаротушения',
            'Знаки безопасности',
            'СКУД (Система контроля управлением доступа)',
            'Аккумуляторы',
            'Блоки питания',
            'Приставки для цифрового телевидения',
            'Кабельная продукция',
            'Сетевое оборудование',
            'Шлагбаумы, турникеты, металлоискатели'
        );

        // индексы массива - это индексы родительского меню - $tempMenuNames
        $tempSubMenuNames = array(
            0 => array(
                'aaa123',
                '123123'
            ),
            1 => array(
                'IP видеодомофоны',
                'Видеодомофоны',
                'Аудиодомофоны',
                'Интеркомы, интерфоны',
                'Видеопанели и видеоглазки'
            ),

            5 => array(
                '123123sasadfa ',
                'aaaaaaa'
            ),
            6 => array(
                '111aaaa'
            )
        );
        // это индексы из своего родительского меню (второго уровеня) - $tempSubMenuNames
        $tempMenuLevel3 = array(
            0 => array(
                '1111111111111',
                '22222222222'
            ),
            1 => array(
                'Переговорные устройства',
                'Видеонаблюдение',
                'Видеодомофоны',
                'Охранно – пожарная сигнализация',
                'Средства пожаротушения',
                'Знаки безопасности',
                'СКУД (Система контроля управлением доступа)',
                'Аккумуляторы',
                'Блоки питания'
            )
        );

        $tempProduct = $db->selectAll("catalog");
        //			print_r($tempProduct)."!!!";
        // инексы тоже из меню второго уровня - $tempSubMenuNames
        $tempPopularProducts = array(
            0 => $tempProduct[1],
            1 => $tempProduct[5]
        );

        foreach ($tempMenuNames as $index => $tempMenuName) {
            ?>
            <div class="item-wrapper">
                <div class="item">
                    <div class="link-wrapper">
                        <a class="link" href="/">
                            <span class="text"><? echo $tempMenuName; ?></span>
                        </a>
                    </div>
					<span class="icon-wrapper">
						<span class="icon g-icon g-icon-arrow-long-right"></span>
					</span>
                </div>
                <?
                if (isset($tempSubMenuNames[$index])) {
                    if (count($tempSubMenuNames[$index]) > 0) {
                        ?>
                        <div class="second-level">
                            <? foreach ($tempSubMenuNames[$index] as $subMenuIndex => $subMenuName) { ?>
                                <div class="item-wrapper">
                                    <div class="item">
										<span class="link-wrapper">
											<a class="link" href="/">
                                                <span class="text"><? echo $subMenuName; ?></span>
                                            </a>
										</span>
										<span class="icon-wrapper">
											<span class="icon g-icon g-icon-arrow-long-right"></span>
										</span>
                                    </div>
                                    <?
                                    if (isset($tempMenuLevel3[$subMenuIndex])) {
                                        if (count($tempMenuLevel3[$subMenuIndex]) > 0) {
                                            ?>
                                            <div class="third-level">
                                                <?
                                                foreach ($tempMenuLevel3[$subMenuIndex] as $menu3Index => $menu3Name) {
                                                    ?>
                                                    <div class="item-wrapper">
                                                        <div class="item">
															<span class="link-wrapper">
																<a class="link" href="/">
                                                                    <span class="text"><? echo $menu3Name; ?></span>
                                                                </a>
															</span>
                                                        </div>
                                                    </div>
                                                <? } ?>
                                                <? if (isset($tempPopularProducts[$subMenuIndex])) { ?>
                                                    <div class="product-wrapper">
                                                        <div class="b-product-in-menu">
                                                            <div class="card">
                                                                <a class="product-link" href="/">
                                                                    <div class="marker">Хит</div>
                                                                    <div class="image-wrapper">
                                                                        <img
                                                                            class="image"
                                                                            src="<?= $imageFolder . $tempPopularProducts[$subMenuIndex]['image']['value'] ?>"
                                                                            alt=""
                                                                            >
                                                                    </div>
                                                                    <div class="link-wrapper js-overflow-ellipsis">
																	<span class="text">
																		<?= $tempPopularProducts[$subMenuIndex]['title']['value'] ?>
																	</span>
                                                                    </div>
                                                                </a>

                                                                <p class="price-wrapper">
																	<span class="price">
																		<?= $tempPopularProducts[$subMenuIndex]['price']['value'] ?>
																	</span>
                                                                    <span class="rub">q</span>
                                                                    <? if ($tempPopularProducts[$subMenuIndex]['oldPrice']['value'] !== "") { ?>
                                                                        <span class="price old">
																		<?= $tempPopularProducts[$subMenuIndex]['oldPrice']['value'] ?>
																	</span>
                                                                        <span class="rub old">q</span>
                                                                    <? } ?>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <? } ?>
                                            </div>
                                            <?
                                        }
                                    }
                                    ?>
                                </div>
                            <? } ?>
                        </div>
                        <?
                    }
                }
                ?>
            </div>
        <? } ?>
    </nav>
</div>
<div class="p-page-wrapper container-fluid">
    <div class="p-page row">
        <div class="p-header-overlay js-header-overlay"></div>
        <div class="p-header-wrapper js-header-wrapper col-md-12" data-search-city="drop-list-location-search">
            <div class="p-city-group">
                <div class="inner">
                    <form class="search-form">
                        <input type="text" class="search-input js-search-input js-clearable-input" placeholder="Поиск">
                        <button class="search-button" type="submit">
								<span class="search-button-content">
									Найти
									<span class="g-icon g-icon-search search-icon"></span>
								</span>
                        </button>
                    </form>
                </div>
					<span class="close-wrapper js-close-icon">
						<span class="close-icon">+</span>
					</span>
                <ul class="items">
                    <li class="item js-city-item letter">а</li>
                    <li class="item js-city-item"><span class="text">Абакан</span></li>
                    <li class="item js-city-item"><span class="text">Азов</span></li>
                    <li class="item js-city-item"><span class="text">Альметьевск</span></li>
                    <li class="item js-city-item"><span class="text">Анапа</span></li>
                    <li class="item js-city-item"><span class="text">Арзамас</span></li>
                    <li class="item js-city-item"><span class="text">Астрахань</span></li>
                    <li class="item js-city-item"><span class="text">Аткарск</span></li>
                    <li class="item js-city-item"><span class="text">Ахтубинск</span></li>
                    <li class="item js-city-item"><span class="text">Ачинск</span></li>
                    <li class="item js-city-item letter">б</li>
                    <li class="item js-city-item"><span class="text">Балаково</span></li>
                    <li class="item js-city-item"><span class="text">Балахна</span></li>
                    <li class="item js-city-item"><span class="text">Балашиха</span></li>
                    <li class="item js-city-item"><span class="text">Балашов</span></li>
                    <li class="item js-city-item"><span class="text">Батайск</span></li>
                    <li class="item js-city-item priority"><span class="text">Белгород</span></li>
                    <li class="item js-city-item"><span class="text">Березники</span></li>
                    <li class="item js-city-item"><span class="text">Богородск</span></li>
                    <li class="item js-city-item"><span class="text">Бор</span></li>
                    <li class="item js-city-item"><span class="text">Борисоглебск</span></li>
                    <li class="item js-city-item"><span class="text">Бугульма</span></li>
                    <li class="item js-city-item"><span class="text">Бугуруслан</span></li>
                    <li class="item js-city-item"><span class="text">Бузулук</span></li>
                    <li class="item js-city-item letter">в</li>
                    <li class="item js-city-item"><span class="text">Великий Новгород</span></li>
                    <li class="item js-city-item"><span class="text">Владикавказ</span></li>
                    <li class="item js-city-item"><span class="text">Владимир</span></li>
                    <li class="item js-city-item priority"><span class="text">Волгоград</span></li>
                    <li class="item js-city-item"><span class="text">Волгодонск</span></li>
                    <li class="item js-city-item"><span class="text">Волжск</span></li>
                    <li class="item js-city-item"><span class="text">Волжский</span></li>
                    <li class="item js-city-item"><span class="text">Вологда</span></li>
                    <li class="item js-city-item"><span class="text">Вольск</span></li>
                    <li class="item js-city-item priority"><span class="text">Воронеж</span></li>
                    <li class="item js-city-item"><span class="text">Ворсма</span></li>
                    <li class="item js-city-item"><span class="text">Выборг</span></li>
                    <li class="item js-city-item"><span class="text">Выкса</span></li>
                    <li class="item js-city-item"><span class="text">Вязники</span></li>
                    <li class="item js-city-item"><span class="text">Вятские Поляны</span></li>
                    <li class="item js-city-item letter">г</li>
                    <li class="item js-city-item"><span class="text">Гатчина</span></li>
                    <li class="item js-city-item"><span class="text">Геленджик</span></li>
                    <li class="item js-city-item"><span class="text">Георгиевск</span></li>
                    <li class="item js-city-item"><span class="text">Городец</span></li>
                    <li class="item js-city-item"><span class="text">Гороховец</span></li>
                    <li class="item js-city-item letter">д</li>
                    <li class="item js-city-item"><span class="text">Дзержинск</span></li>
                    <li class="item js-city-item"><span class="text">Димитровград</span></li>
                    <li class="item js-city-item"><span class="text">Дмитров</span></li>
                    <li class="item js-city-item"><span class="text">Долгопрудный</span></li>
                    <li class="item js-city-item"><span class="text">Домодедово</span></li>
                    <li class="item js-city-item letter">е</li>
                    <li class="item js-city-item"><span class="text">Ейск</span></li>
                    <li class="item js-city-item priority"><span class="text">Екатеринбург</span></li>
                    <li class="item js-city-item"><span class="text">Елабуга</span></li>
                    <li class="item js-city-item letter">ж</li>
                    <li class="item js-city-item"><span class="text">Железногорск</span></li>
                    <li class="item js-city-item"><span class="text">Железнодорожный</span></li>
                    <li class="item js-city-item"><span class="text">Жигулевск</span></li>
                    <li class="item js-city-item"><span class="text">Жирновск</span></li>
                    <li class="item js-city-item"><span class="text">Жуковский</span></li>
                    <li class="item js-city-item letter">з</li>
                    <li class="item js-city-item"><span class="text">Заволжье</span></li>
                    <li class="item js-city-item"><span class="text">Закамск</span></li>
                    <li class="item js-city-item"><span class="text">Заречный</span></li>
                    <li class="item js-city-item"><span class="text">Зеленогорск</span></li>
                    <li class="item js-city-item"><span class="text">Зеленоград</span></li>
                    <li class="item js-city-item"><span class="text">Зеленодольск</span></li>
                    <li class="item js-city-item"><span class="text">Златоуст</span></li>
                    <li class="item js-city-item"><span class="text">Знаменск</span></li>
                    <li class="item js-city-item letter">и</li>
                    <li class="item js-city-item"><span class="text">Иваново</span></li>
                    <li class="item js-city-item"><span class="text">Изобильный</span></li>
                    <li class="item js-city-item letter">й</li>
                    <li class="item js-city-item"><span class="text">Йошкар-Ола</span></li>
                    <li class="item js-city-item letter">к</li>
                    <li class="item js-city-item"><span class="text">Казань</span></li>
                    <li class="item js-city-item"><span class="text">Калач-на-Дону</span></li>
                    <li class="item js-city-item"><span class="text">Калуга</span></li>
                    <li class="item js-city-item"><span class="text">Каменск-Уральский</span></li>
                    <li class="item js-city-item light"><span class="text">Каменск-Шахтинский</span></li>
                    <li class="item js-city-item"><span class="text">Камышин</span></li>
                    <li class="item js-city-item"><span class="text">Каневская</span></li>
                    <li class="item js-city-item"><span class="text">Канск</span></li>
                    <li class="item js-city-item"><span class="text">Кинель</span></li>
                    <li class="item js-city-item"><span class="text">Кириши</span></li>
                    <li class="item js-city-item"><span class="text">Клин</span></li>
                    <li class="item js-city-item"><span class="text">Ковров</span></li>
                    <li class="item js-city-item"><span class="text">Колпино</span></li>
                    <li class="item js-city-item"><span class="text">Копейск</span></li>
                    <li class="item js-city-item"><span class="text">Королев</span></li>
                    <li class="item js-city-item"><span class="text">Кострома</span></li>
                    <li class="item js-city-item"><span class="text">Котельниково</span></li>
                    <li class="item js-city-item"><span class="text">Котово</span></li>
                    <li class="item js-city-item"><span class="text">Красногорск</span></li>
                    <li class="item js-city-item priority"><span class="text">Краснодар</span></li>
                    <li class="item js-city-item"><span class="text">Краснокамск</span></li>
                    <li class="item js-city-item priority"><span class="text">Красноярск</span></li>
                    <li class="item js-city-item"><span class="text">Кропоткин</span></li>
                    <li class="item js-city-item"><span class="text">Кстово</span></li>
                    <li class="item js-city-item"><span class="text">Кулебаки</span></li>
                    <li class="item js-city-item"><span class="text">Курган</span></li>
                    <li class="item js-city-item"><span class="text">Курск</span></li>
                    <li class="item js-city-item"><span class="text">Кыштым</span></li>
                    <li class="item js-city-item letter">л</li>
                    <li class="item js-city-item"><span class="text">Лениногорск</span></li>
                    <li class="item js-city-item priority disabled"><span class="text">Липецк</span></li>
                    <li class="item js-city-item"><span class="text">Лысково</span></li>
                    <li class="item js-city-item"><span class="text">Люберцы</span></li>
                    <li class="item js-city-item letter">м</li>
                    <li class="item js-city-item"><span class="text">Магнитогорск</span></li>
                    <li class="item js-city-item"><span class="text">Майкоп</span></li>
                    <li class="item js-city-item"><span class="text">Маркс</span></li>
                    <li class="item js-city-item"><span class="text">Миасс</span></li>
                    <li class="item js-city-item"><span class="text">Михайловка</span></li>
                    <li class="item js-city-item"><span class="text">Морозовск</span></li>
                    <li class="item js-city-item priority"><span class="text">Москва</span></li>
                    <li class="item js-city-item"><span class="text">Муром</span></li>
                    <li class="item js-city-item"><span class="text">Мытищи</span></li>
                    <li class="item js-city-item letter">н</li>
                    <li class="item js-city-item"><span class="text">Набережные челны</span></li>
                    <li class="item js-city-item priority"><span class="text">Нижний Новгород</span></li>
                    <li class="item js-city-item letter">т</li>
                    <li class="item js-city-item"><span class="text">Таганрог</span></li>
                    <li class="item js-city-item"><span class="text">Тамбов</span></li>
                    <li class="item js-city-item"><span class="text">Тверь</span></li>
                    <li class="item js-city-item"><span class="text">Тимашевск</span></li>
                    <li class="item js-city-item"><span class="text">Тихорецк</span></li>
                    <li class="item js-city-item"><span class="text">Тольятти</span></li>
                    <li class="item js-city-item"><span class="text">Тосно</span></li>
                    <li class="item js-city-item"><span class="text">Троицк</span></li>
                    <li class="item js-city-item letter">ф</li>
                    <li class="item js-city-item"><span class="text">Фролово</span></li>
                    <li class="item js-city-item letter">х</li>
                    <li class="item js-city-item"><span class="text">Химки</span></li>
                    <li class="item js-city-item letter">ч</li>
                    <li class="item js-city-item"><span class="text">Чапаевск</span></li>
                    <li class="item js-city-item"><span class="text">Чебоксары</span></li>
                    <li class="item js-city-item"><span class="text">Челябинск</span></li>
                    <li class="item js-city-item"><span class="text">Череповец</span></li>
                    <li class="item js-city-item"><span class="text">Черкесск</span></li>
                    <li class="item js-city-item"><span class="text">Чехов</span></li>
                    <li class="item js-city-item"><span class="text">Чистополь</span></li>
                    <li class="item js-city-item"><span class="text">Чкаловск</span></li>
                    <li class="item js-city-item letter">ш</li>
                    <li class="item js-city-item"><span class="text">Шахты</span></li>
                    <li class="item js-city-item"><span class="text">Шуя</span></li>
                    <li class="item js-city-item letter">щ</li>
                    <li class="item js-city-item"><span class="text">Щёлково</span></li>
                    <li class="item js-city-item letter">э</li>
                    <li class="item js-city-item"><span class="text">Элиста</span></li>
                    <li class="item js-city-item"><span class="text">Энгельс</span></li>
                    <li class="item js-city-item letter">я</li>
                    <li class="item js-city-item"><span class="text">Ярославль</span></li>
                </ul>
            </div>
            <div class="p-user-form login-form js-content-inner">
					<span class="close-wrapper js-close-icon">
						<span class="close-icon">+</span>
					</span>

                <form class="form">
                    <div class="tabs">
                        <span class="tab active">Вход</span>
                        <span class="tab">Регистрация</span>
                    </div>
                    <div class="form-group">
                        <label class="label" for="login-form-header-email-input">E-mail</label>
                        <input class="input" id="login-form-header-email-input js-clearable-input">
                        <span class="error-message">Введите логин</span>
                    </div>
                    <div class="form-group">
                        <label class="label" for="login-form-header-password-input">Пароль</label>
                        <input class="input js-password-input js-clearable-input"
                               id="login-form-header-password-input" type="password">
                        <i class="g-icon g-icon-eye-closed eye js-eye"></i>
                    </div>
                    <div class="action-wrapper">
                        <input type="submit" class="submit" value="Войти">
                        <span class="restore">Восстановить пароль</span>
                    </div>
                </form>
            </div>
            <div class="p-user-form wide call-me feedback-form js-content-inner">
					<span class="close-wrapper js-close-icon">
						<span class="close-icon">+</span>
					</span>

                <form class="form">
                    <div class="tabs">
                            <span class="tab active js-list-item js-tab"
                                  data-for="drop-list-phone">Перезвонить мне</span>
                        <span class="tab js-list-item js-tab" data-for="drop-list-send-message">Задать вопрос</span>
                    </div>
                    <div class="form-group">
                        <label class="label" for="feedback-form-header-name-input">Имя <sup
                                class="sup">*</sup></label>
                        <input class="input js-clearable-input" id="feedback-form-header-name-input">
                    </div>
                    <div class="form-group may-hide">
                        <label class="label" for="feedback-form-header-password-input">E-mail <sup
                                class="sup">*</sup></label>
                        <input class="input js-clearable-input" id="feedback-form-header-password-input">
                    </div>
                    <div class="form-group">
                        <label class="label" for="feedback-form-header-phone-input">Телефон <sup
                                class="sup may-show">*</sup></label>
                        <input class="input js-clearable-input" id="feedback-form-header-phone-input">
                    </div>
                    <div class="form-group may-hide">
                        <label class="label" for="feedback-form-header-order-input">Заказ №</label>
                        <input class="input js-clearable-input" id="feedback-form-header-order-input">
                    </div>
                    <div class="form-group big may-hide">
                        <label class="label" for="feedback-form-header-question-text">Вопрос <sup
                                class="sup">*</sup></label>
                            <textarea id="feedback-form-header-question-text"
                                      class="input js-clearable-input"></textarea>
                    </div>
                    <div class="action-wrapper">
                        <input type="submit" class="submit" value="Отправить">
                    </div>
                </form>
            </div>
            <div class="p-info js-content-inner">
					<span class="close-wrapper js-close-icon">
						<span class="close-icon">+</span>
					</span>
                <ul class="items">
                    <li class="item">
                        <a class="text">О компании</a>
                    </li>
                    <li class="item">
                        <a class="text">Новости</a>
                    </li>
                    <li class="item">
                        <a class="text">Наши магазины</a>
                    </li>
                    <li class="item">
                        <a class="text">Контактая информация</a>
                    </li>
                    <li class="item">
                        <a class="text">Как сделать заказ</a>
                    </li>
                    <li class="item">
                        <a class="text">Оплата</a>
                    </li>
                    <li class="item active">
                        <a class="text">Доставка</a>
                    </li>
                    <li class="item">
                        <a class="text">Гарантия</a>
                    </li>
                    <li class="item">
                        <a class="text">Часто задаваемые вопросы</a>
                    </li>
                    <li class="item">
                        <a class="text">Акции и скидки</a>
                    </li>
                    <li class="item">
                        <a class="text">Прайс-листы</a>
                    </li>
                    <li class="item disabled">
                        <a class="text">Форум</a>
                    </li>
                </ul>
            </div>
            <div class="p-profile js-content-inner">
					<span class="close-wrapper js-close-wrapper">
						<span class="close-icon js-close-icon">+</span>
					</span>
                <ul class="items">
                    <li class="item">
                        <a class="text">Редактировать профиль</a>
                    </li>
                    <li class="item">
                        <a class="text">История заказов</a>
                    </li>
                    <li class="item">
                        <a class="text">Корзина</a>
                    </li>
                    <li class="item">
                        <a class="text">Состояние заказов</a>
                    </li>
                    <li class="item active">
                        <a class="text">Выход</a>
                    </li>
                </ul>
            </div>
            <div class="p-header js-upper-header">
                <div class="common">
                    <div class="list-item cities-drop-list js-list-item" data-for="drop-list-location">
                        <p class="group-item dotted js-city-name-in-header">Липецк</p>
                    </div>
                    <div class="list-item send-message js-list-item" data-for="drop-list-phone">
                        <p class="group-item highlighted dotted">+7 (4742) 28-66-66</p>
                    </div>
                    <div class="list-item information js-list-item" data-for="drop-list-info">
                        <p class="group-item">Информация</p>
                    </div>
                    <div class="list-item">
                        <p class="group-item">Монтаж</p>
                    </div>
                </div>
                <div class="services">
                    <div class="list-item right-border">
                        <p class="group-item">Сравнить</p>
                    </div>
                    <div class="list-item">
                        <span class="g-icon g-icon-basket basket"></span>

                        <p class="group-item">
                            Корзина пуста
                        </p>
                        <span class="money hidden">3 226 700 <span class="rub-font">q</span></span>
                    </div>
                    <div class="list-item left-border enter js-list-item js-enter" data-for="drop-list-enter">
                        <p class="group-item wide">Вход</p>
                    </div>
                    <div class="list-item left-border enter js-list-item hidden js-profile"
                         data-for="drop-list-profile">
                        <p class="group-item wide">Профиль</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-user-form wide call-me feedback-form js-content-inner">
					<span class="close-wrapper js-close-icon">
						<span class="close-icon">+</span>
					</span>

            <form class="form">
                <div class="tabs">
                            <span class="tab active js-list-item js-tab"
                                  data-for="drop-list-phone">Перезвонить мне</span>
                    <span class="tab js-list-item js-tab" data-for="drop-list-send-message">Задать вопрос</span>
                </div>
                <div class="form-group">
                    <label class="label" for="feedback-form-header-name-input">Имя <sup
                            class="sup">*</sup></label>
                    <input class="input js-clearable-input" id="feedback-form-header-name-input">
                </div>
                <div class="form-group may-hide">
                    <label class="label" for="feedback-form-header-password-input">E-mail <sup
                            class="sup">*</sup></label>
                    <input class="input js-clearable-input" id="feedback-form-header-password-input">
                </div>
                <div class="form-group">
                    <label class="label" for="feedback-form-header-phone-input">Телефон</label>
                    <input class="input js-clearable-input" id="feedback-form-header-phone-input">
                </div>
                <div class="form-group may-hide">
                    <label class="label" for="feedback-form-header-order-input">Заказ №</label>
                    <input class="input js-clearable-input" id="feedback-form-header-order-input">
                </div>
                <div class="form-group big may-hide">
                    <label class="label" for="feedback-form-header-question-text">Вопрос <sup
                            class="sup">*</sup></label>
                            <textarea id="feedback-form-header-question-text"
                                      class="input js-clearable-input"></textarea>
                </div>
                <div class="action-wrapper">
                    <input type="submit" class="submit" value="Отправить">
                </div>
            </form>
        </div>
        <div class="p-info js-content-inner">
					<span class="close-wrapper js-close-icon">
						<span class="close-icon">+</span>
					</span>
            <ul class="items">
                <li class="item">
                    <a class="text">О компании</a>
                </li>
                <li class="item">
                    <a class="text">Новости</a>
                </li>
                <li class="item">
                    <a class="text">Наши магазины</a>
                </li>
                <li class="item">
                    <a class="text">Контактая информация</a>
                </li>
                <li class="item">
                    <a class="text">Как сделать заказ</a>
                </li>
                <li class="item">
                    <a class="text">Оплата</a>
                </li>
                <li class="item active">
                    <a class="text">Доставка</a>
                </li>
                <li class="item">
                    <a class="text">Гарантия</a>
                </li>
                <li class="item">
                    <a class="text">Часто задаваемые вопросы</a>
                </li>
                <li class="item">
                    <a class="text">Акции и скидки</a>
                </li>
                <li class="item">
                    <a class="text">Прайс-листы</a>
                </li>
                <li class="item disabled">
                    <a class="text">Форум</a>
                </li>
            </ul>
        </div>
        <div class="p-profile js-content-inner">
					<span class="close-wrapper js-close-wrapper">
						<span class="close-icon js-close-icon">+</span>
					</span>
            <ul class="items">
                <li class="item">
                    <a class="text">Редактировать профиль</a>
                </li>
                <li class="item">
                    <a class="text">История заказов</a>
                </li>
                <li class="item">
                    <a class="text">Корзина</a>
                </li>
                <li class="item">
                    <a class="text">Состояние заказов</a>
                </li>
                <li class="item active">
                    <a class="text">Выход</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="p-content-wrapper">


