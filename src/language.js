function GetString(name){
    const strings = {
        "diet-chart-no-data":{
            "HU": "Nincs adat rögzitve a megadott dátumhoz!",
            "EN": "There is no data for the selected date!"
        },
        "page-home":{
            "HU": "Főoldal",
            "EN": "Home"
        },
        "page-plan":{
            "HU": "Edzésterv",
            "EN": "Plan"
        },
        "page-create":{
            "HU": "Edzés létrehozása",
            "EN": "Create Workout"
        },
        "page-browse":{
            "HU": "Gyakorlatok",
            "EN": "Browse Exercises"
        },
        "page-diet":{
            "HU": "Étkezés",
            "EN": "Diet"
        },
        "page-saved":{
            "HU": "Mentett Edzéseim",
            "EN": "Saved Workouts"
        },
        "page-account":{
            "HU": "Fiók Beállítások",
            "EN": "My Account"
        },
        "streak-start":{
            "HU": "",
            "EN": "You are on a "
        },
        "streak-end":{
            "HU": " napos edzés sorozatod van!",
            "EN": " days workout streak!"
        },
        "navbar-welcome":{
            "HU": "Üdvözöljük, ",
            "EN": "Welcome, "
        },
        "home-period":{
            "HU": ["Heti", "Havi", "Fél éves", "Éves", "Összes"],
            "EN": ["Weekly", "Monthly", "6 Months", "Yearly", "All"]
        },
        "create-select-a-muscle":{
            "HU": "Válasszon ki egy izomcsoportot és húzzon ide egy gyakorlatot",
            "EN": "Select a muscle and drag & drop the template here"
        },
        "create-template":{
            "HU": "Gyakorlatok",
            "EN": "Templates"
        },
        "browse-choose-a-muscle":{
            "HU": "Válasszon ki egy izomcsoportot melyre edzeni szeretne!",
            "EN": "Choose a muscle group that you wanna train!"
        },
        "browse-suggest":{
            "HU": "Ajánlj edzéseket",
            "EN": "Suggest me workouts"
        },
        "workouts":{
            "HU": "Edzések",
            "EN": "Workouts"
        }
    };
    return strings[name][localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'HU']
}
export default GetString;