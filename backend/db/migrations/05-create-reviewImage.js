'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
    options.tableName = 'ReviewImages'
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable( options, {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            reviewId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Reviews',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            url: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ReviewImages', options);
    },
};
