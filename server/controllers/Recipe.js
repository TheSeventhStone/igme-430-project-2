const models = require("../models");
const Recipe = models.Recipe;

const makerPage = (req,res) => {
    res.render("app");
};

const getRecipes = async (req,res) => {
     try{
        const query = {owner: req.session.account._id};
        const docs = await Recipe.find(query).select("name ingredients creator").lean().exec();

        return res.json({recipes: docs});
    }
    catch (err){
        console.log(err);
        return res.status(500).json({error: "Error retrieving recipes!"}); 
    }
};

const makeRecipe = async (req,res) => {
    if(!req.body.name || !req.body.ingredients){
        return res.status(400).json({error: "Both name and ingredients are required!"});
    }

    let ing_rough = (req.body.ingredients.split(","));
    let ing = [];
    ing_rough.forEach(element => {
        ing.push(element.trim());  
    });
    const recipeData = {
        name: req.body.name,
        ingredients: ing,
        owner: req.session.account._id,
        creator: req.session.account.username,
    };

    try{
        const newRecipe = new Recipe(recipeData);
        await newRecipe.save();
        return res.status(201).json({name: newRecipe.name, ingredients: newRecipe.ingredients, creator: newRecipe.creator});
    }
    catch (err){
        if(err.code === 11000){
            return res.status(400).json({error: "Recipe already exists!"});
        }
        return res.status(500).json({error: "An error occured making recipe!"});
    }
};




module.exports = {
    makerPage,
    makeRecipe,
    getRecipes,
};