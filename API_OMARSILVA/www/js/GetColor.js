function getRecipes(done) {
  const results = fetch("https://www.themealdb.com/api/json/v1/1/random.php");

  results
    .then(response => response.json())
    .then(data => {
      done(data);
    })
    .catch(error => {
      console.error('Error al obtener las recetas:', error);
      done(null); // Llama a done con null para indicar que ocurrió un error
    });
}

getRecipes(data => {
  console.log(data);
});


// const searchMeal = async (e) => {
//   e.preventDefault();

//   // Select Elements
//   const input = document.querySelector(".input");
//   const title = document.querySelector(".title");
//   const info = document.querySelector(".info");
//   const img = document.querySelector(".img");
//   const ingredientsOutput = document.querySelector(".ingredients");

//   const showMealInfo = (meal) => {
//     const { strMeal, strMealThumb, strInstructions } = meal;
//     title.textContent = strMeal;
//     img.style.backgroundImage = `url(${strMealThumb})`;
//     info.textContent = strInstructions;

//     const ingredients = [];

//     for (let i = 1; i <= 20; i++) {
//       if (meal[`strIngredient${i}`]) {
//         ingredients.push(
//           `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
//         );
//       } else {
//         break;
//       }
//     }

//     const html = `
//     <span>${ingredients
//       .map((ing) => `<li class="ing">${ing}</li>`)
//       .join("")}</span>
//     `;

//     ingredientsOutput.innerHTML = html;
//   };

//   const showAlert = () => {
//     alert("Meal not found :(");
//   };

//   // Fetch Data
//   const fetchMealData = async (val) => {
//     const res = await fetch(
//       `https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`
//     );

//     const { meals } = await res.json();
//     return meals;
//   };

//   // Get the user value
//   const val = input.value.trim();

//   if (val) {
//     const meals = await fetchMealData(val);

//     if (!meals) {
//       showAlert();
//       return;
//     }

//     meals.forEach(showMealInfo);
//   } else {
//     alert("Please try searching for meal :)");
//   }
// };

// const form = document.querySelector('form');
// form.addEventListener("submit", searchMeal);

// const magnifier = document.querySelector(".magnifier");
// magnifier.addEventListener("click", searchMeal);

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

