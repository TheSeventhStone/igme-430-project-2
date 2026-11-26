import { set } from "mongoose";

const helper = require("./helper.js");
const React = require("react");
const {useState, useEffect} = React;
const {createRoot} = require("react-dom/client");

const handleRecipe= (e, onRecipeAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#recipeName").value;
    const ingredients = e.target.querySelector("#recipeIngredients").value;

    if(!name || !ingredients){
        helper.handleError("All fields are required!");
        return false;
    }

    helper.sendPost(e.target.action, {name,ingredients}, onRecipeAdded);
    return false;
}

const RecipeForm = (props) => {
    return(
        <form id="recipeForm"
            onSubmit={(e) => handleRecipe(e,props.triggerReload)}
            name="recipeForm"
            action="/maker"
            method="POST"
            className="recipeForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="recipeName" type="text" name="name" placeholder="Recipe Name"/>
            <label htmlFor="ingredients">Ingredients: </label>
            <input id="recipeIngredients" type="text" name="ingredients"  placeholder="Recipe Ingredients (comma seperated)"/>
            <input className="makeRecipeSubmit" type="submit" value="Make Recipe"/>
        </form>
    );
};

const RecipeList = (props) => {
    const [recipes, setRecipes] = useState(props.recipes);

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch("/getRecipes");
            const data = await response.json();
            setRecipes(data.recipes);
        };
        loadRecipesFromServer();
    }, [props.reloadRecipes]);

    if(recipes.length === 0){
        return(
            <div className="recipeList">
                <h3 className="emptyRecipe">No Recipes Yet!</h3>
            </div>
        );
    }


    const recipeNodes = recipes.map(recipe => {
        return(
            <div key={recipe.id} className="recipe">
                <img src="assets/img/domoface.jpeg" alt="recipe face" className="recipeFace"/>
                <h3 className="recipeName">Name: {recipe.name}</h3>
                <h3 className="recipeIngredients">Ingredients:</h3>
                <ul>
                    {recipe.ingredients.map((ing) => (
                        <li>{ing}</li>
                    ))}
                </ul>
                <h3 className="recipeCreator">Created By: {recipe.creator}</h3>
            </div>
        );
    });

    return(
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

const App = () => {
    const [reloadRecipes, setReloadRecipes] = useState(false);

    return(
        <div>
            <div id="makeRecipe">
                <RecipeForm triggerReload={() => setReloadRecipes(!reloadRecipes)}/>
            </div>
            <div id="recipes">
                <RecipeList recipes={[]} reloadRecipes={reloadRecipes}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById("app"));
    root.render(<App/>);
};

window.onload = init;