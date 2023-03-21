const searchInput = document.querySelector('#search-input')
const searchBtn = document.querySelector('.search-btn')
const loading = document.getElementById('loading')
const appDesc = document.querySelector('.app-desc')
const recipeContainer = document.querySelector(".recipe-container")
const recipeImg = document.querySelector(".img-container")
const recipeName = document.querySelector('#recipe-name')
const recipeDesc = document.querySelector('#recipe-desc')
const ingredients = document.querySelector('#ingredients')
const instructionsList = document.querySelector("#instructions-list")
const totalTime = document.querySelector('#total-time')
const cookTime = document.querySelector('#cook-time')
const prepTime = document.querySelector('#prep-time')

const options = {
	method: 'GET',
	headers: {
        // API-KEY HAS BEEN REMOVED FOR SECURITY
		'X-RapidAPI-Key': 'ENTER API-KEY HERE',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

async function getRecipe() {
    loading.classList.remove('hidden')
    await fetch(`https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes&q=${searchQuery}`, options)
	.then(response => response.json())
	.then(response => {
        var randomRecipe = response.results[Math.floor(Math.random() * response.results.length)]
        console.log(randomRecipe)
        printRecipe(randomRecipe); 
    })
	.catch(err => {
        console.error(err);
        loading.classList.add('hidden')
        recipeContainer.classList.add('hidden')
        appDesc.classList.remove('hidden')
        appDesc.innerText = "Sorry we couldn't find any results for that search. Please Try again.";
    });
}

const printRecipe = (recipe) => {
    if (recipe.canonical_id.includes("recipe")) {
        loading.classList.add('hidden')
        recipeName.innerText = recipe.name;
        recipeDesc.innerText = recipe.description;
        if(recipe.thumbnail_url){
            recipeImg.style.backgroundImage = `url('${recipe.thumbnail_url}')`;
        }
        if(recipe.total_time_minutes){
            totalTime.innerText = recipe.total_time_minutes + " mins";
        }
        if(recipe.cook_time_minutes){
            cookTime.innerText = recipe.cook_time_minutes + " mins";
        }
        if(recipe.prep_time_minutes){
            prepTime.innerText = recipe.prep_time_minutes + " mins";
        }
        const recipeSections = recipe.sections;

        recipeSections.forEach(section =>{
            let ingredientSection = document.createElement("div");
            let ul = document.createElement("ul");
            if (section.name) {
                let sectionTitle = document.createElement("h4");
                sectionTitle.innerText = section.name;
                ingredientSection.appendChild(sectionTitle);
            }

            section.components.forEach((component)=>{ 
                let li = document.createElement("li");
                li.innerText = component.raw_text;
                ul.appendChild(li);
            })
            ingredientSection.appendChild(ul);
            ingredients.appendChild(ingredientSection); 
        })

        const instructions = recipe.instructions
        instructions.forEach((step)=>{
            let cookingStep = document.createElement("li");
            cookingStep.innerText = step.display_text;
            instructionsList.appendChild(cookingStep);
        })
        appDesc.classList.add('hidden');
        recipeContainer.classList.remove('hidden');
        searchInput.value = '';
    } else {
        getRecipe();
    }

} 
 
let searchQuery = '';

searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
})

searchBtn.addEventListener('click', getRecipe)