"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "SpotImages";
        await queryInterface.bulkInsert(
            options,
            [
                // Empire State Building
                {
                    spotId: 1,
                    url: "https://www.esbnyc.com/sites/default/files/2024-06/ESB-DarkBlueSky.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 1,
                    url: "https://assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/GettyImages-486334510_CC36FC20-0DCE-7408-77C72CD93ED4A476-cc36f9e70fc9b45_cc36fc73-07dd-b6b3-09b619cd4694393e.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 1,
                    url: "https://images.ctfassets.net/1aemqu6a6t65/6iCC1vCYS1Br0sfIVbVBAH/13cc013e2e3f76bb247452bcfa4eb6d6/empire-state-building-observatory-ctc-7009-3000x2000?w=1200&h=800&q=75",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 1,
                    url: "https://www.esbnyc.com/sites/default/files/2020-01/ESB%20Day.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 1,
                    url: "https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2020-07/General-Cityscape2.jpg?itok=sWy2vug1",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Eiffel Tower
                {
                    spotId: 2,
                    url: "https://www.travelandleisure.com/thmb/SPUPzO88ZXq6P4Sm4mC5Xuinoik=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eiffel-tower-paris-france-EIFFEL0217-6ccc3553e98946f18c893018d5b42bde.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 2,
                    url: "https://quiltripping.com/wp-content/uploads/2017/07/DSC_0379-scaled.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 2,
                    url: "https://as1.ftcdn.net/v2/jpg/01/70/58/92/1000_F_170589233_65jydTJ365ZlCtsFyenQ0f3HH5TeE16A.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 2,
                    url: "https://worldinparis.com/wp-content/uploads/2020/12/View-from-Eiffel-Tower.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Great Wall of China
                {
                    spotId: 3,
                    url: "https://cdn.thecollector.com/wp-content/uploads/2020/08/great-wall-of-china-photo-smithsonian.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 3,
                    url: "https://lik.com/cdn/shop/products/Peter-Lik-Great-Wall-Framed-Recess-Mount_1800x.jpg?v=1654818277",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 3,
                    url: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/02/11164059/Jinshanling-great-wall.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 3,
                    url: "https://lh4.googleusercontent.com/proxy/C7tyFryPoKPm4_Ukuwc5Rq1vlWrLjcpd9JwNwQxj-_9sQZOp0cJH03dV72rbIANgli9BdzCamho0CfUthwVHYMJlMeLj02ASI8LZTukpujk-uKAvVp8yoQO-3HftFZ8pqEz6L2AycWiWHRcwKB8fRszb0A",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Taj Mahal
                {
                    spotId: 4,
                    url: "https://www.travelandleisure.com/thmb/wdUcyBQyQ0wUVs4wLahp0iWgZhc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/taj-mahal-agra-india-TAJ0217-9eab8f20d11d4391901867ed1ce222b8.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 4,
                    url: "https://storyateverycorner.com/wp-content/uploads/2023/12/Taj-Mahal-at-sunrise-4.jpeg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 4,
                    url: "https://images.unsplash.com/photo-1548013146-72479768bada?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFqJTIwbWFoYWx8ZW58MHx8MHx8fDA%3D",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 4,
                    url: "https://kenzly.com/wp-content/uploads/2024/08/Taj-Mahal.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 4,
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Taj_Mahal_Mosque_Interior_Hall.jpg/2560px-Taj_Mahal_Mosque_Interior_Hall.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Colosseum
                {
                    spotId: 5,
                    url: "https://cdn.mos.cms.futurecdn.net/BiNbcY5fXy9Lra47jqHKGK.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 5,
                    url: "https://cdn.britannica.com/02/179502-138-AE3BE74C/effects-construction-Rome-Colosseum.jpg?w=800&h=450&c=crop",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 5,
                    url: "https://cdn.shortpixel.ai/spai/q_lossy+w_977+h_549+to_auto+ret_img/www.thecolosseum.org/wp-content/uploads/colosseum-inside-optimized-1600x900.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 5,
                    url: "https://media.cntraveler.com/photos/59d3a805ddaded4e04772233/16:9/w_2560%2Cc_limit/Rome_GettyImages-841851056.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 5,
                    url: "https://www.touristitaly.com/wp-content/uploads/2023/10/shutterstock_2087415520-1024x576.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 5,
                    url: "https://visit-rome-in-italy.global.ssl.fastly.net/pics/ancient-rome/colosseum/colosseum-arena-rome-italy-15.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Sydney Opera House
                {
                    spotId: 6,
                    url: "https://shorturl.at/sjZh4",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 6,
                    url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Sydney_Australia._%2821339175489%29.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 6,
                    url: "https://cdn.britannica.com/85/95085-050-C749819D/Sydney-Opera-House-Bennelong-Point-Port-Jackson.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 6,
                    url: "https://destinationlesstravel.com/wp-content/uploads/2023/10/Inside-the-concert-hall-of-the-Sydney-Opera-House-as-seen-on-a-tour-1200x800.jpg.webp",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Stonehenge
                {
                    spotId: 7,
                    url: "https://cdn.mos.cms.futurecdn.net/q4i42ws72RZ3sEcx2QT3iV-1200-80.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 7,
                    url: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-08/240812-Stonehenge-al-1453-500701.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 7,
                    url: "https://stonehengetickets.tours/wp-content/uploads/2022/04/red-sky-stonehenge.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 7,
                    url: "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-682586546.jpg?c=16x9&q=h_833,w_1480,c_fill",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Pyramids of Giza
                {
                    spotId: 8,
                    url: "https://cdn.britannica.com/06/122506-050-C8E03A8A/Pyramid-of-Khafre-Giza-Egypt.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 8,
                    url: "https://www.touristegypt.com/wp-content/uploads/2023/03/giza-pyramids-cairo-egypt-with-palm-1024x634.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 8,
                    url: "https://i.natgeofe.com/n/535f3cba-f8bb-4df2-b0c5-aaca16e9ff31/giza-plateau-pyramids.jpg?w=2560&h=1706",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 8,
                    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/7e/7d/2c/pyramids-of-giza.jpg?w=1200&h=-1&s=1",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 8,
                    url: "https://images.ladbible.com/resize?type=webp&quality=70&width=3840&fit=contain&gravity=auto&url=https://images.ladbiblegroup.com/v3/assets/blt949ea8e16e463049/blta705aa69124df8bf/664e3523305fa453f1725bb0/pyramid-giza.png",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Machu Picchu
                {
                    spotId: 9,
                    url: "https://www.peru.travel/Contenido/Noticia/Imagen/en/2052/1.0/Principal/circuits_mapi_Desktop.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 9,
                    url: "https://cdn.britannica.com/25/180725-050-03DE70E6/area-Machu-Picchu-Peru.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 9,
                    url: "https://i.natgeofe.com/n/819ea774-aa80-435e-af5a-ae56efee7ce3/92491_4x3.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 9,
                    url: "https://caminoincamachupicchu.org/cmingutd/wp-content/uploads/2021/06/machu-picchu-llama.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 9,
                    url: "https://www.southamerica.travel/wp-content/uploads/2020/03/machu-picchu-mountain-in-the-clouds.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 9,
                    url: "https://etrvls-website.s3.amazonaws.com/uploads/2023/09/Enchanting-Travels-Peru-Tours-Panoramic-HDR-image-of-Machu-Picchu-the-lost-city-of-the-Incas-on-a-cloudy-day.-Machu-Picchu-is-one-of-the-new-7-Wonder-of-the-Word-near-Cusco.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Burj Khalifa
                {
                    spotId: 10,
                    url: "https://cdn1.matadornetwork.com/blogs/1/2023/04/Burj-Khalifa-Dubai.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 10,
                    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f3/49/93/photo5jpg.jpg?w=1200&h=-1&s=1",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 10,
                    url: "https://volzero.com/img/news/88071_banner.jpg",
                    preview: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    spotId: 10,
                    url: "https://worldoflina.com/wp-content/uploads/2023/05/DSC_0744.jpg",
                    preview: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "SpotImages";
        await queryInterface.bulkDelete(options, null, {});
    },
};