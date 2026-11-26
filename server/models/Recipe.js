const mongoose = require("mongoose");
const _ = require("underscore");
const setName = (name) => _.escape(name).trim();


const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    age: {
        type: Number,
        min: 0,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Account",
    },
    creator: {
        type: String,
        required: true,
        trim: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

RecipeSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    creator: doc.creator,
});

const RecipeModel = mongoose.model("Recipe", RecipeSchema);
module.exports = RecipeModel;