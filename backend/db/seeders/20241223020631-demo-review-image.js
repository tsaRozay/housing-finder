"use strict";
const { ReviewImage } = require("../models");
const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        await queryInterface.bulkInsert(
            options,
            [
                // Reviews for Empire State Building
                {
                    reviewId: 1,
                    url: "https://destinationlesstravel.com/wp-content/uploads/2023/08/Binoculars-on-the-Empire-State-Building-86th-floor-observatory.jpg.webp",
                },
                {
                    reviewId: 2,
                    url: "https://cdn-imgix.headout.com/tour/10974/TOUR-IMAGE/940303d2-f97e-4af4-aecd-e601a345e1a5-6013-new-york-twin-peaks-empire-state-building---top-of-the-rock-tickets-01.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces",
                },
                {
                    reviewId: 3,
                    url: "https://cdn-imgix.headout.com/media/images/e912196c79528ed6d539ccaea371e4c1-Why%20Should%20You%20Visit.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces",
                },
                // Reviews for Eiffel Tower
                {
                    reviewId: 4,
                    url: "https://images.stockcake.com/public/2/3/6/23600bb3-9672-4b60-90a0-dd29fa8019e6_large/eiffel-tower-night-stockcake.jpg",
                },
                {
                    reviewId: 5,
                    url: "https://curioustravelbug.com/wp-content/uploads/2019/09/Eiffel-Tower-Paris-France-Summer-Picnic-1024x683.jpg",
                },
                {
                    reviewId: 6,
                    url: "https://static1.squarespace.com/static/5d44ca6e28f0880001b7a6a2/5d44cc09c51d93000113b28c/630de2bd7d270723772de9e9/1727897356947/IMG-3354.jpg?format=1500w",
                },
                // Reviews for Great Wall of China
                {
                    reviewId: 7,
                    url: "https://www.wanderlustmagazine.com/wp-content/uploads/2023/11/5-1-scaled.jpg",
                },
                {
                    reviewId: 8,
                    url: "https://thehelpfulpanda.b-cdn.net/wp-content/uploads/2024/02/crowded-great-wall-of-china-1200x640.jpg",
                },
                // Reviews for Taj Mahal
                {
                    reviewId: 9,
                    url: "https://i.natgeofe.com/n/7da2b27b-9c28-4735-bada-6c4589e0eeeb/93079_3x2.jpg",
                },
                {
                    reviewId: 10,
                    url: "https://images.squarespace-cdn.com/content/v1/5e1077b0019b062397153b23/1583229780988-Z3FOM2AUU3ZA2VQ9XM7Z/Taj+Mahal+Travel+Tips+Photography-22.jpg",
                },
                {
                    reviewId: 11,
                    url: "https://liisawanders.com/wp-content/uploads/2023/10/Visiting-the-Taj-Mahal-in-Sari.jpeg",
                },
                // Reviews for Colosseum
                {
                    reviewId: 12,
                    url: "https://www.thetrainline.com/cms/media/10910/italy-rome-collosseum.jpg?mode=crop&width=1080&height=1080&quality=70",
                },
                {
                    reviewId: 13,
                    url: "https://images.squarespace-cdn.com/content/v1/62015f66f840ef671da14ae7/a39b95cc-ba0b-47ff-bb0d-dfd5e46e38cd/20220525-Floremce-Rome-157.JPG",
                },
                // Reviews for Sydney Opera House
                {
                    reviewId: 14,
                    url: "https://cdn-imgix.headout.com/tour/20072/TOUR-IMAGE/d85280d5-3c4f-4f54-bd7a-6fc5cc68597f-10732-sydney-sydney-and-bondi-tour-with-sydney-opera-house-tour-01.jpg",
                },
                {
                    reviewId: 15,
                    url: "https://cdn-imgix.headout.com/tour/23283/TOUR-IMAGE/a0ac288a-515f-45c8-8d0e-2b2cc4323359-Sydney-Opera-House-concert-hall-October-2018.jpeg?auto=format&w=1069.6000000000001&h=687.6&q=90&fit=crop&ar=14%3A9&crop=faces",
                },
                // Reviews for Stonehenge
                {
                    reviewId: 16,
                    url: "https://whyy.org/wp-content/uploads/2023/06/AP23172272226283.jpg",
                },
                {
                    reviewId: 17,
                    url: "https://www.mondayfeelings.com/wp-content/uploads/2023/04/Stonehenge-Summer-solstice-1024x683.jpg",
                },
                {
                    reviewId: 18,
                    url: "https://cdn-imgix.headout.com/media/images/26bfa607b1d788dafce8a860ad8e82bb-stonehenge.jpg?auto=format&w=900&h=562.5&q=90&ar=16%3A10&crop=faces%2Ccenter&fit=crop",
                },
                // Reviews for Pyramids of Giza
                {
                    reviewId: 19,
                    url: "https://www.usatoday.com/gcdn/presto/2023/03/02/USAT/c07f91fc-22be-4732-9907-c1843ca0282b-AFP_AFP_33AD4XA.jpg?crop=4098,5464,x1228,y0",
                },
                {
                    reviewId: 20,
                    url: "https://egyptianstreets.com/wp-content/uploads/2016/01/pyr4.jpg",
                },
                // Reviews for Machu Picchu
                {
                    reviewId: 21,
                    url: "https://www.boletomachupicchu.com/gutblt/wp-content/uploads/2024/05/machu-picchu-pareja-experiencia-inolvidable-full.jpg",
                },
                {
                    reviewId: 22,
                    url: "https://static01.nyt.com/images/2022/04/04/multimedia/00xp-machupicchu/00xp-machupicchu-superJumbo.jpg",
                },
                // Reviews for Burj Khalifa
                {
                    reviewId: 23,
                    url: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0f/53/cf/7b.jpg",
                },
                {
                    reviewId: 24,
                    url: "https://media02.stockfood.com/largepreviews/MjIwODA4MTIzNw==/71228427-At-the-Top-Sky-Burj-Khalifa-View-Visitors-Level-148-555-Meter-Dubai-UAE-United-Arab-Emirates.jpg",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        await queryInterface.bulkDelete(options, null, {});
    },
};