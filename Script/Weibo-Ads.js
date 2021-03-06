/*
微博广告 = type=http-response,requires-body=true,max-size=false,pattern=^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)(mix)?timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|!/(photos/pic_recommend_status|live/media_homelist)|video/tiny_stream_video_list|photo/info|remind/unread_count),script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/Weibo-Ads.js
*/


const path_timeline = "/groups/timeline";
const path_unread = "/statuses/unread";
const path_extend = "/statuses/extend";
const path_build_comments = "/comments/build_comments";
const path_recommend_list = "/photo/recommend_list";
const path_video_stream = "/stories/video_stream";
const path_positives_get = "/statuses/positives/get";
const path_home_list = "/stories/home_list";
const path_profile_statuses = "/profile/statuses";
const path_statuses_friends_timeline = "/statuses/friends/timeline";
const path_picfeed = "/service/picfeed";
const path_fangle_timeline = "/fangle/timeline";
const path_searchall = "/searchall";
const path_cardlist = "/cardlist";
const path_video_timeline = "/statuses/video_timeline";
const path_page = "/page";
const path_friends_timeline = "/statuses/friends_timeline";
const path_pic_recommend_status = "/!/photos/pic_recommend_status";
const path_video_mixtimeline = "/statuses/video_mixtimeline";
const path_tiny_stream_video_list = "/video/tiny_stream_video_list";
const path_info = "/photo/info";

const url = $request.url;
let body = $response.body;

function filter_timeline_statuses(statuses) {
    if (statuses && statuses.length > 0) {
        let i = statuses.length;
        while (i--) {
            let element = statuses[i];
            if (is_timeline_likerecommend(element.title) ||
                is_timeline_ad(element) ||
                is_stream_video_ad(element)) {
                statuses.splice(i, 1);
            }
        }
    }
    return statuses;
}

function filter_comments(datas) {
    if (datas && datas.length > 0) {
        let i = datas.length;
        while (i--) {
            const element = datas[i];
            const type = element.type;
            if (type == 5 || type == 1 || type == 6) datas.splice(i, 1);
        }
    }
    return datas;
}

function filter_timeline_cards(cards) {
    if (cards && cards.length > 0) {
        let j = cards.length;
        while (j--) {
            let item = cards[j];
            let card_group = item.card_group;
            if (card_group && card_group.length > 0) {
                if (item.itemid && item.itemid == "hotword") {
                    filter_top_search(card_group);
                } else {
                    let i = card_group.length;
                    while (i--) {
                        let card_group_item = card_group[i];
                        let card_type = card_group_item.card_type;
                        if (card_type) {
                            if (card_type == 9) {
                                if (is_timeline_ad(card_group_item.mblog)) card_group.splice(i, 1);
                            } else if (card_type == 118 || card_type == 89) {
                                card_group.splice(i, 1);
                            } else if (card_type == 42) {
                                if (card_group_item.desc == '\u53ef\u80fd\u611f\u5174\u8da3\u7684\u4eba') {
                                    cards.splice(j, 1);
                                    break;
                                }
                            } else if (card_type == 17) {
                                filter_top_search(card_group_item.group);
                            }
                        }
                    }
                }
            } else {
                let card_type = item.card_type;
                if (card_type && card_type == 9) {
                    if (is_timeline_ad(item.mblog)) cards.splice(j, 1);
                }
            }
        }
    }
    return cards;
}

function filter_top_search(group) {
    if (group && group.length > 0) {
        let k = group.length;
        while (k--) {
            let group_item = group[k];
            if (group_item.hasOwnProperty("promotion")) {
                group.splice(k, 1);
            }
        }
    }
}

function is_timeline_ad(mblog) {
    if (!mblog) return false;
    let promotiontype = mblog.promotion && mblog.promotion.type && mblog.promotion.type == "ad";
    let mblogtype = mblog.mblogtype && mblog.mblogtype == 1;
    return (promotiontype || mblogtype) ? true : false;
}

function is_timeline_likerecommend(title) {
    return title && title.type && title.type == "likerecommend" ? true : false;
}

function is_stream_video_ad(item) {
    return item.ad_state && item.ad_state == 1
}

if (
    url.indexOf(path_timeline) != -1 ||
    url.indexOf(path_unread) != -1 ||
    url.indexOf(path_statuses_friends_timeline) != -1 ||
    url.indexOf(path_video_timeline) != -1 ||
    url.indexOf(path_friends_timeline) != -1 ||
    url.indexOf(path_tiny_stream_video_list) != -1
) {
    let obj = JSON.parse(body);
    if (obj.statuses) obj.statuses = filter_timeline_statuses(obj.statuses);
    if (obj.advertises) obj.advertises = [];
    if (obj.ad) obj.ad = [];
    if (obj.num) obj.num = obj.original_num;
    if (obj.trends) obj.trends = [];
    body = JSON.stringify(obj);
} else if (url.indexOf(path_extend) != -1) {
    let obj = JSON.parse(body);
    if (obj.trend) delete obj.trend;
    body = JSON.stringify(obj);
} else if (url.indexOf(path_build_comments) != -1) {
    let obj = JSON.parse(body);
    obj.recommend_max_id = 0;
    if (obj.status) {
        if (obj.top_hot_structs) {
            obj.max_id = obj.top_hot_structs.call_back_struct.max_id;
            delete obj.top_hot_structs;
        }
        if (obj.datas) obj.datas = filter_comments(obj.datas);
    } else {
        obj.datas = [];
    }
    body = JSON.stringify(obj);
} else if (url.indexOf(path_recommend_list) != -1 ||
    url.indexOf(path_pic_recommend_status) != -1) {
    let obj = JSON.parse(body);
    obj.data = {};
    body = JSON.stringify(obj);
} else if (url.indexOf(path_video_stream) != -1) {
    let obj = JSON.parse(body);
    let segments = obj.segments;
    if (segments && segments.length > 0) {
        let i = segments.length;
        while (i--) {
            const element = segments[i];
            let is_ad = element.is_ad;
            if (is_ad && is_ad == true) segments.splice(i, 1);
        }
    }
    body = JSON.stringify(obj);
} else if (url.indexOf(path_positives_get) != -1) {
    let obj = JSON.parse(body);
    obj.datas = [];
    body = JSON.stringify(obj);
} else if (url.indexOf(path_home_list) != -1) {
    let obj = JSON.parse(body);
    obj.story_list = [];
    body = JSON.stringify(obj);
} else if (url.indexOf(path_picfeed) != -1) {
    let obj = JSON.parse(body);
    obj.data = [];
    body = JSON.stringify(obj);
} else if (
    url.indexOf(path_profile_statuses) != -1 ||
    url.indexOf(path_fangle_timeline) != -1 ||
    url.indexOf(path_searchall) != -1 ||
    url.indexOf(path_cardlist) != -1 ||
    url.indexOf(path_page) != -1
) {
    let obj = JSON.parse(body);
    if (obj.cards) obj.cards = filter_timeline_cards(obj.cards);
    body = JSON.stringify(obj);
} else if (url.indexOf(path_video_mixtimeline) != -1) {
    let obj = JSON.parse(body);
    delete obj.expandable_view;
    if (obj.hasOwnProperty('expandable_views'))
        delete obj.expandable_views;
    body = JSON.stringify(obj);
} else if (url.indexOf(path_info) != -1) {
    if (body.indexOf("ad_params") != -1) {
        body = JSON.stringify({});
    }
}

$done({body});
