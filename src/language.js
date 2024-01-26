function GetString(name) {
    const strings = {
        "diet-chart-no-data": {
            "HU": "Nincs adat rögzitve a megadott dátumhoz!",
            "EN": "There is no data for the selected date!"
        },
        "page-home": {
            "HU": "Főoldal",
            "EN": "Home"
        },
        "page-plan": {
            "HU": "Edzésterv",
            "EN": "Plan"
        },
        "page-create": {
            "HU": "Edzés létrehozása",
            "EN": "Create Workout"
        },
        "page-browse": {
            "HU": "Gyakorlatok",
            "EN": "Browse Exercises"
        },
        "page-diet": {
            "HU": "Étkezés",
            "EN": "Diet"
        },
        "page-saved": {
            "HU": "Mentett Edzéseim",
            "EN": "Saved Workouts"
        },
        "page-account": {
            "HU": "Fiók Beállítások",
            "EN": "My Account"
        },
        "streak-start": {
            "HU": "",
            "EN": "You are on a "
        },
        "streak-end": {
            "HU": " napos edzés sorozatod van!",
            "EN": " days workout streak!"
        },
        "navbar-welcome": {
            "HU": "Üdvözöljük, ",
            "EN": "Welcome, "
        },
        "home-period": {
            "HU": ["Heti", "Havi", "Fél éves", "Éves", "Összes"],
            "EN": ["Weekly", "Monthly", "6 Months", "Yearly", "All"]
        },
        "create-select-a-muscle": {
            "HU": "Válasszon ki egy izomcsoportot és húzzon ide egy gyakorlatot",
            "EN": "Select a muscle and drag & drop the template here"
        },
        "create-template": {
            "HU": "Gyakorlatok",
            "EN": "Templates"
        },
        "browse-choose-a-muscle": {
            "HU": "Válasszon ki egy izomcsoportot melyre edzeni szeretne!",
            "EN": "Choose a muscle group that you wanna train!"
        },
        "browse-suggest": {
            "HU": "Ajánlj edzéseket",
            "EN": "Suggest me workouts"
        },
        "exercises": {
            "HU": "Gyakorlatok",
            "EN": "Exercises"
        },
        "alert-login-success": {
            "HU": "Sikeres bejelentkezés!",
            "EN": "Successful login!"
        }
        ,
        "alert-login-error": {
            "HU": ["Hoppá!", "A megadott mezők hibásak"],
            "EN": ["Oops!", "The credentials doesn't match!"]
        },
        "alert-logged-out": {
            "HU": ["Hoppá!", "Ki lett jelentkeztetve!"],
            "EN": ["Oops!", "You have been logged out!"]
        },
        "alert-general-error": {
            "HU": ["Hoppá!", "Valami hiba történt!"],
            "EN": ["Oops!", "An error occured!"]
        },
        "alert-workout-saved": {
            "HU": ["Edzés elmentve!", " sikeresen el lett mentve!"],
            "EN": ["Workout saved!", " was saved succesfully"]
        },
        "alert-workout-imported": {
            "HU": ["Sikeresen másolva!", " sikeresen bemásolva!"],
            "EN": ["Successfully imported!", " was imported succesfully"]
        },
        "alert-change-language": {
            "HU": ["Nyelv megváltoztatása?", "Ez a művelet újra fogja tölteni az oldalt! Minden mentetlen változtatás törlödik!", "Ne változtassa!", "Változtassa!"],
            "EN": ["Change language?", "This will reload the page! All unsaved changes will be deleted!", "No, dont change it!", "Yes, change it!"]
        },
        "tip-level-1": {
            "HU": "Fontolja meg több olyan gyakorlat beiktatását, amelyek megcélozzák a/az !muscle! a kiegyensúlyozott fejlődés érdekében.",
            "EN": "Consider incorporating more exercises targeting your !muscle! for balanced development."
        },
        "tip-level-2": {
            "HU": "Jó egyensúlyt tartasz fenn a/az !muscle! gyakorlása során. Csak így tovább!",
            "EN": "You are maintaining a good balance in exercising your !muscle!. Keep it up!"
        },
        "tip-level-3": {
            "HU": "A/Az !muscle! túl vannak edzve! Hagyd pihenni egy kicsit, hogy fokozd az izomnövekedést!",
            "EN": "Your !muscle! are over exercised! Let it rest a bit to enchance muscle growth!"
        },
        "muscle-chest": {
            "HU": "mell",
            "EN": "chest"
        },
        "muscle-traps": {
            "HU": "hátizom",
            "EN": "trapezius"
        },
        "muscle-shoulder": {
            "HU": "vállizom",
            "EN": "shoulder"
        },
        "muscle-chest": {
            "HU": "mellizom",
            "EN": "chest"
        },
        "muscle-biceps": {
            "HU": "bicepsz",
            "EN": "biceps"
        },
        "muscle-triceps": {
            "HU": "tricepsz",
            "EN": "triceps"
        },
        "muscle-lats": {
            "HU": "széles hátizom",
            "EN": "latissimus dorsi"
        },
        "muscle-abs": {
            "HU": "hasizom",
            "EN": "abdominals"
        },
        "muscle-obliques": {
            "HU": "oldalsó hasizom",
            "EN": "obliques"
        },
        "muscle-quadriceps": {
            "HU": "combizom",
            "EN": "quadriceps"
        },
        "muscle-calves": {
            "HU": "vádli",
            "EN": "calves"
        },
        "muscle-leg": {
            "HU": "combizom",
            "EN": "thigh"
        },
        "muscle-forearm": {
            "HU": "alkar",
            "EN": "forearm"
        },
        "muscle-glutes": {
            "HU": "farizom",
            "EN": "glutes"
        },
        "muscle-hamstrings": {
            "HU": "hátsó combizom",
            "EN": "hamstrings"
        },
        "muscle-adductors": {
            "HU": "adduktorok",
            "EN": "adductors"
        },
        "muscle-midBack": {
            "HU": "középső hátizom",
            "EN": "mid-back"
        },
        "muscle-neck": {
            "HU": "nyakizom",
            "EN": "neck"
        }

    };
    return strings[name][localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'HU']
}
export default GetString;