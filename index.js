const cheerio = require('cheerio');
const URL = "http://scpvakfi.wikidot.com/scp-";
const axios = require('axios');
module.exports = async (code) => {
    const body = await axios.get(URL + code).catch(err => {
        if (err.response.status) {
            throw new Error("SCP bulunamadı!");
            return;
        }
    });
    const $ = cheerio.load(body.data);
    const scp = $('#page-title').text().trim() || null;
    const special_containment_procedures = $('strong:contains("Özel Saklama Prosedürleri:")').parent().text().slice(26).trim() || null;
    const description = $('strong:contains("Açıklama:")').parent().text().slice(9).trim() || null;
    const object_class = $('strong:contains("Nesne Sınıfı:")').parent().text().slice(13).trim() || null;
    const reference = $('strong:contains("Referans:")').parent().text().slice(9).trim() || null;
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
        scp: scp,
        object_class: object_class,
        special_containment_procedures: special_containment_procedures,
        description: description,
        reference: reference,
        images: image_left.concat(image_right, image_center)
    }
}