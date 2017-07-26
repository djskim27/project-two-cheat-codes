const express = require('express');

const User = require('../models/user');

const router = express.Router({ mergeParams: true });

// INDEX
router.get('/', (request, response) => {
    const userIdToFind = request.params.userId;

    User.findById(userIdToFind)
        .then((user) => {
            response.render(
                'items/index',
                {
                    userId: user._id,
                    userName: user.first_name,
                    items: user.items
                }
            )
        })
});

// SHOW
router.get('/:itemId', (request, response) => {
    const userId = request.params.userId;
    const itemId = request.params.itemId;

    User.findById(userId)
        .then((user) => {

            const foundItem = user.items.find((item) => {
                return item.id === itemId
            });

            response.render(
                'items/show',
                {
                    userId,
                    userName: user.first_name,
                    itemId: foundItem._id,
                    itemName: foundItem.name
                }
            )
        })
        .catch((error) => {
            console.log("Failed to find user");
        })
});

// RENDER THE EDIT FORM
router.get('/:itemId/edit', (request, response) => {
    const userId = request.params.userId;
    const itemId = request.params.itemId;

    User.findById(userId)
        .then((user) => {
            const foundItem = user.items.find((item) => {
                return item.id === itemId;
            })

            response.render('items/edit', {
                userId,
                item: foundItem
            });
        })
});

// UPDATE AN ITEM
router.put('/:itemId', (request, response) => {
    const userId = request.params.userId;
    const itemId = request.params.itemId;

    User.findById(userId)
        .then((user) => {
            const foundItem = user.items.find((item) => {
                return item.id === itemId;
            })

            foundItem.name = request.body.name;

            user.save()
                .then((user) => {
                    console.log("updated user with ID of " + user._id)

                    response.render(
                        'items/index',
                        {
                            userId: user._id,
                            userName: user.first_name,
                            items: user.items
                        }
                    )
                })
        })

});

module.exports = router;