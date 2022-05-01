const cheerio = require('cheerio');
const URL = "http://scpvakfi.wikidot.com/";
const axios = require('axios');
module.exports = async ({code: code}) => {
    if (!code) throw new Error("SCP numarası belirtilmedi!");
    const body = await axios.get(URL + code).catch(() => {
    })
    if (body === undefined) {
        return null;
    }
    const $ = cheerio.load(body.data);
    const item = $('strong:contains("Nesne #:")').parent().text().slice(8).trim() || $('strong:contains("Madde #:")').parent().text().slice(8).trim() || null;
    const special_containment_procedures = $('strong:contains("Özel Saklama Prosedürleri:")').parent().text().slice(26).trim() || null;
    const description = $('strong:contains("Açıklama:")').parent().text().slice(9).trim() || null;
    const discovery = $('strong:contains("Keşif:")').parent().text().slice(6).trim() || null;
    const object_class = $('strong:contains("Nesne Sınıfı:")').parent().text().slice(13).trim() || $('strong:contains("Obje Sınıfı:")').parent().text().slice(12).trim() || null;
    const reference = $('strong:contains("Referans:")').parent().text().slice(9).trim() || null;
    const image = $('#page-content > div[class="image"] > img').map((i, el) => {
        return {
            image: $(el).attr('src') || null,
            description: $('#page-content > div[class="image"] > div[class="scp-image-caption"] > p').eq(i).text().trim() || null
        }
    }).get()
    const image_left = $('#page-content > div[class="scp-image-block block-left"] > img').map((i, el) => {
        return {
            image: $(el).attr('src') || null,
            description: $('#page-content > div[class="scp-image-block block-left"] > div[class="scp-image-caption"] > p').eq(i).text().trim() || null
        }
    }).get()
    const image_right = $('#page-content > div[class="scp-image-block block-right"] > img').map((i, el) => {
        return {
            image: $(el).attr('src') || null,
            description: $('#page-content > div[class="scp-image-block block-right"] > div[class="scp-image-caption"] > p').eq(i).text().trim() || null
        }
    }).get()
    const image_center = $('#page-content > div[class="scp-image-block block-center"] > img').map((i, el) => {
        return {
            image: $(el).attr('src') || null,
            description: $('#page-content > div[class="scp-image-block block-center"] > div[class="scp-image-caption"] > p').eq(i).text().trim() || null
        }
    }).get()
    return {
        url: URL + code,
        item: item,
        object_class: object_class,
        special_containment_procedures: special_containment_procedures,
        description: description,
        discovery: discovery,
        reference: reference,
        images: image.concat(image_left, image_right, image_center),
        raw: function () {
            return {
                html: body.data
            }
        }
    }
}