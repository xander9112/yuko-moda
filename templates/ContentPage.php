<?
include('../header.php');

$catalog = $db->selectAll("catalog");
?>
    <div class="row">
        <div class="col-md-10 b-highlighted-block">
            <h4 class="block-header">Если понадобится, можно таким вот образом выделить заголовок статьи или
                новости</h4>

            <p class="description">
                Ну, и раскрыть чуть-чуть тему ниже, чтобы сразу было понятно о чём пойдёт речь на странице.
                Если очень прям захочется - в этот блок можно влеписть слайдер, аналогичный тому, что стоит на главной.
            </p>
        </div>
        <p class="col-md-10 block-description">
            10 ноября 2015
        </p>

        <h1 class="col-md-10">Заголовок типа H1</h1>

        <div class="col-md-8">
            <p class="highlighted-text">
                Преамбула или выдержка. Наша компания была основана в 2004 году, а наш интернет-магазин стал одним из
                первых
                магазинов, осуществляющих on-line продажу инженерно-технических средств безопасности в Липецке.
            </p>

            <p>
                На данный момент мы представляем собой крупную компанию, владеющую<br> интернет–магазином и имеющую в
                своей
                сети единый call-центр, который регулирует всю деятельность магазина, отдел продаж, службу доставки,
                собственный
                склад c постоянным<br> наличием необходимого запаса товаров.
            </p>

            <p>
                За это время у нас сложились партнерские отношения с ведущими производителями, позволяющие предлагать
                высококачественную продукцию по конкурентоспособным ценам.
            </p>

            <p>
                Мы можем гордиться тем, что у нас один из самый широкий ассортимент инженерно-технических средств
                безопасности
                в городе Липецке.
            </p>

            <h2>Заголовок типа H2</h2>

            <p>
                На данный момент мы представляем собой крупную компанию, владеющую интернет–магазином и имеющую в своей
                сети
                единый call-центр, который регулирует всю деятельность магазина, отдел продаж, опа! жирный текст службу
                доставки, собственный склад c постоянным наличием необходимого запаса товаров.
            </p>

            <p>
                За это время у нас сложились партнерские отношения с ведущими производителями, позволяющие предлагать
                высококачественную продукцию по конкурентоспособным ценам.
            </p>
            <div class="b-tabs js-tabs-handler">
                <div class="b-headers-list">
                    <div class="item current js-tab">Активный таб</div>
                    <div class="item dashed js-tab">Просто таб</div>
                    <div class="item dashed js-tab">Ховеренный таб</div>
                </div>
                <div class="outer js-outer">
                    <div class="content-wrapper js-content-wrapper">
                        <div class="tab-content js-tab-content show">
                            <div class="tab-inner">
                                <p>
                                    За это время у нас сложились партнерские отношения с ведущими производителями, позволяющие предлагать
                                    высококачественную продукцию по конкурентоспособным ценам:
                                </p>
                                <ul>
                                    <li>
                                        Пункт первый маркированного списка
                                    </li>
                                    <li>
                                        Второй пункт потянет, вероятно, аж на две строки потому, что нельзя просто взять и не показать,
                                        как он должен выглядеть
                                    </li>
                                    <li>
                                        Третий пункт — чисто для массовки
                                    </li>
                                </ul>
                                <p>
                                    Мы можем гордиться тем, что у нас один из самый широкий ассортимент инженерно-технических средств
                                    безопасности в городе Липецке.
                                </p>
                            </div>
                        </div>
                        <div class="tab-content js-tab-content">
                            <div class="tab-inner">
                                <p>
                                    Второй таб
                                </p>
                            </div>
                        </div>
                        <div class="tab-content js-tab-content">
                            <div class="tab-inner">
                                <ul>
                                    <li>
                                        Пункт первый маркированного списка треьего таба
                                    </li>
                                    <li>
                                        Второй пункт потянет, вероятно, аж на две строки потому, что нельзя просто взять и не показать,
                                        как он должен выглядеть
                                    </li>
                                    <li>
                                        Третий пункт — чисто для массовки
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h3>Заголовок таблицы, стилем H3</h3>
            <table>
                <tr>
                    <th>Колонка 1</th>
                    <th>Колонка 2</th>
                    <th>Колонка 3</th>
                </tr>
                <tr>
                    <td>Ячейка 1/1</td>
                    <td>Ячейка 1/2</td>
                    <td>Ячейка 1/3</td>
                </tr>
                <tr>
                    <td>Ячейка 2/1</td>
                    <td>Ячейка 2/2</td>
                    <td>Ячейка 2/3</td>
                </tr>
                <tr>
                    <td>Ячейка 3/1</td>
                    <td>Ячейка 3/2</td>
                    <td>Ячейка 3/3</td>
                </tr>
                <tr>
                    <td>Ячейка 4/1</td>
                    <td>Ячейка 4/2</td>
                    <td>Ячейка 4/3</td>
                </tr>
                <tr>
                    <td>Ячейка 5/1</td>
                    <td>Ячейка 5/2</td>
                    <td>Ячейка 5/3</td>
                </tr>
            </table>
            <p class="less-highlighted-text">
                Ажно! Олния! Подпись или какой-то текст неочевидный, но важный. На данный момент мы представляем собой
                крупную компанию, владеющую интернет–магазином и имеющую в своей сети единый call-центр, который
                регулирует всю деятельность магазина, отдел продаж, службу доставки, собственный склад c постоянным
                наличием необходимого запаса товаров.
            </p>

            <div class="b-content-slider js-content-slider">
                <div class="counter-wrapper">
                    <span class="counter"><span class="js-current-slide">1</span>/3</span>
                </div>
                <div class="outer">
                    <div class="arrow-left js-backward">
                        <i class="g-icon g-icon-big-arrow-left icon"></i>
                    </div>
                    <div class="arrow-right js-forward">
                        <i class="g-icon g-icon-big-arrow-right icon"></i>
                    </div>
                    <div class="wrapper">
                        <div class="items js-items">
                            <div class="item js-item">
                                <img class="image" src="<? echo $imageFolder; ?>slide2.png" alt="" width="700" height="420">
                                <p class="block-description show js-description">
                                    Подпись под фото. На данный момент может очень даже пригодится.
                                </p>
                            </div>
                            <div class="item js-item">
                                <img class="image" src="<? echo $imageFolder; ?>slide2.png" alt="" width="700" height="420">
                                <p class="block-description js-description">
                                    Подпись под фото. На данный момент может очень даже пригодится.
                                </p>
                            </div>
                            <div class="item js-item">
                                <img class="image" src="<? echo $imageFolder; ?>slide2.png" alt="" width="700" height="420">
                                <p class="block-description js-description">
                                    Подпись под фото. На данный момент может очень даже пригодится.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p>
                На данный момент мы представляем собой крупную компанию, владеющую интернет–магазином и имеющую в своей
                сети
                единый call-центр, который регулирует всю деятельность магазина, отдел продаж, службу доставки,
                собственный
                склад c постоянным наличием необходимого запаса товаров.
            </p>
            <ol>
                <li>
                    Пункт первый нумерованного списка
                </li>
                <li>
                    Второй пункт потянет, вероятно, аж на две строки потому, что нельзя просто взять и не показать, как
                    он
                    должен выглядеть
                </li>
                <li>
                    Третий пункт — снова для массовки
                </li>
            </ol>
            <div class="b-video-block js-video-block" data-video-type="youtube" data-video-id="OKQSOCc9_5I">
                <div class="inner js-inner">
                    <img class="image" src="<? echo $imageFolder; ?>slide3.jpg" alt="">
                    <div class="icon-wrapper"></div>
                    <span class="g-icon g-icon-play icon"></span>
                </div>
                <p class="block-description">
                    Подпись под видео. На данный момент может очень даже пригодится.
                </p>
            </div>
            <div class="b-share">
                <span class="share-text">Поделиться:</span>
                <a class="" href="/">1</a>
                <a class="" href="/">2</a>
                <a class="" href="/">3</a>
                <a class="" href="/">4</a>
                <a class="" href="/">5</a>
            </div>
        </div>
    </div>

<?
include('../footer.php');
?>
