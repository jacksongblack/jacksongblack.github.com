// 异步载入对象
function LoadHtml(element) {
    this.element = $(element)
    this.url = this.element.attr("href")
}
LoadHtml.prototype = {
    constructor: LoadHtml,
    addUrlHistory: function (response) {
        var state = {htmlContent: response}
        window.history.pushState(state, '', this.url)
    },
    changeBlogContent: function (response) {
        var ajaxHtml = $(response).find("div#show_post").children()
        $("#show_post").append(ajaxHtml)
    },
    changeBlogTitle: function (response) {
        var ajaxHtml = $(response)[3].text
        $("title").html(ajaxHtml)
    },
    reviewPage: function (response, fn) {
        this.changeBlogContent(response);
        this.addUrlHistory(response);
        this.changeBlogTitle(response)
        fn()
    },
//  请求数据方法
    getServer: function (fn, el) {
        var thisMe = this
        if (typeof(fn) == "function") {
            $.get(this.url, function (response) {
                thisMe.reviewPage(response, fn);
            })
        }
    }
}
//清空或是增加页面内容
function EditorHtml(docObj) {
    this.docObj = $(docObj)
}
EditorHtml.prototype = {
    constructor: EditorHtml,
    removeHtml: function () {
        this.docObj.empty();
    },
    addHtml: function (html) {
        this.docObj.html(html)
    }
}
//页面载入后初始化程序
function initPage() {
    var category_switch = $(".category_switch")
    var pushOrPull = new blogDisplayModel(".category_switch")
    var displayMode = new DisplayMode()

    function init() {
        bindCategoryLinkOnclickEvent();
        bindSidebarClickEvent();
        CategoryLinksWalkel();
        BlogTextLinksWalker();
        addSidebarHoverEvent();
        addPostHoverEvent();
    }

    function addSidebarHoverEvent(){
        var sidebar =   $("#open_sidebar")
        sidebar.hover(function(){   
            sidebar.click();
        })
    }

    function addPostHoverEvent(){
        var post =  $("#post")
        var sidebar =   $("#open_sidebar")
        post.hover(function(){
            if( sidebar.text() == "关闭最近" ){
               sidebar.click();
            }
        })
    }


    function bindCategoryLinkOnclickEvent() {
        category_switch.click(function () {
            if (pushOrPull.getStatus("glyphicon-arrow-left")) {
                pushOrPull.show(function (link) {
                    displayMode.openUp()
                    link.html("关闭种类")
                })

            } else {
                pushOrPull.hide(function (link) {
                    displayMode.shutDown()
                    link.html("打开种类")
                })


            }
        })
    }

    function removeCategoryLinkBackgroundColor(currentLink) {
        $("#category li a").each(
            function () {
                if (this != currentLink) {
                    factoryBlogDisplayModel("[data-url=" + $(this).attr("data-url") + "]").hide(function (link) {
                        link.removeClass("marker_color")
                    })
                }
            }
        )
    }

    function addCategoryLinkBackgroundColor() {
        var displayModel = factoryBlogDisplayModel("[data-url=" + $(this).attr("data-url") + "]")
        var currentLink = this
        $(this).click(function () {
            displayModel.show(function (link) {
                link.addClass("marker_color")
            })
            removeCategoryLinkBackgroundColor(currentLink);
        })
    }

    function CategoryLinksWalkel() {
        $("#category li a").each(function () {
            addCategoryLinkBackgroundColor.call(this);
        })
    }

    function toggleDuoshuoComments(container) {
        var obj = $(".ds-thread")
        var el = document.createElement('div');//该div不需要设置class="ds-thread"
        el.setAttribute('data-thread-key', obj.attr("data-thread-key"));//必选参数
        el.setAttribute('data-url', obj.attr("data-url"));//必选参数
        DUOSHUO.EmbedThread(el);
        jQuery(container).append(el);
    }

    function bindBlogLinkClickEvent() {
        var load = new LoadHtml(this)
        var html = new EditorHtml(".show_post")
        $(this).click(function () {
            $('.progress').show()
            html.removeHtml()
            displayMode.shutDown()
            load.getServer(function () {
                toggleDuoshuoComments("#show_post")
                $('.progress').hide()
            })

        })
    }

    function BlogTextLinksWalker() {
        $("#posts ul li a").each(function () {
            bindBlogLinkClickEvent.call(this);
        })
    }

    function bindSidebarClickEvent() {
        $("#open_sidebar").sidr({
                side: 'right',
                name: "recent",
                onOpen: function () {
                    window.setTimeout(function () {
                        var recent_width = $("#recent").width();
                        var sidebarObj = $(".sidebar_right_menu")
                        sidebarObj.css("right", recent_width)
                        sidebarObj.find("a").html("关闭最近")
                    }, 200)
                },
                onClose: function () {
                    window.setTimeout(function () {
                        var sidebarObj = $(".sidebar_right_menu")
                        sidebarObj.css("right", 0)
                        sidebarObj.find("a").html("最近文章")
                    }, 200)
                }
            }
        )
    }

    return {init: init}
}

$(window).ready(function () {
    initPage().init();
    //增加阅览器地址变化时的处理
    window.addEventListener("popstate", function (e) {
        if (e.state) {
            var ajaxHtml = $(e.state.htmlContent).find("div#show_post").children()
            $("#show_post").empty()
            $("#show_post").append(ajaxHtml)
            toggleDuoshuoComments("#show_post")
            $('.progress').hide()
        }
    })
})
