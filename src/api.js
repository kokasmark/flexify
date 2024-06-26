import { host } from "./constants";


function justTokenArgs(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Token", args.token)



    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    return requestOptions;
}

export function login(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      user: args.user,
      password: args.password,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return requestOptions;
}
export function signup(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: args.username,
      email: args.email,
      password: args.password,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return requestOptions;
}
export function user_muscles(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    token: args.token,
    timespan: args.timespan,
    location: "web",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function user(args){
    return justTokenArgs(args);
}
export function exercises(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)



  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return requestOptions;
}
export function templates(args){
    return justTokenArgs(args);
}
export function workouts_dates(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Token", args.token)
    var raw = JSON.stringify({
      token: args.token,
      date: args.date,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return requestOptions;
}
export function workouts_data(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    token: args.token,
    date: args.date,
    location: "web",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function workouts_save(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    token: args.token,
    name: args.name,
    duration: args.duration,
    json: args.json,
    time: args.time,
    date: args.date,
    location: "web",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function workouts_finish(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    id: args.id,
    location: "web",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function workouts_finished(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)


  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return requestOptions;
}
export function templates_save(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    token: args.token,
    name: args.name,
    json: args.json,
    location: "web"
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function admin_tables(args){
  return justTokenArgs(args);
}
export function admin_data(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    table: args.table,
    page: args.page
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function admin_update(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    table: args.table,
    id: args.id,
    values: args.values
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function admin_delete(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    table: args.table,
    id: args.id
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function admin_insert(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    table: args.table,
    values: args.values
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function diet(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    date: args.date,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function diet_add(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    json: args.json,
    date: args.date
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export function templates_delete(args){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Token", args.token)
  var raw = JSON.stringify({
    id: args.id,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return requestOptions;
}
export async function CallApi(route, args) {
    const apiFunctions = 
    {   login,
        signup,
        user,

        user_muscles,
        exercises,
        templates,
        templates_save,
        templates_delete,
        workouts_dates,
        workouts_data,
        workouts_save,
        workouts_finish,
        workouts_finished,
        diet,
        diet_add,

        admin_tables,
        admin_data,
        admin_update,
        admin_delete,
        admin_insert
    }; 
    const apiFunc = apiFunctions[route.replace("/","_")]; // Get the corresponding API function based on the route
    if (!apiFunc) {
        throw new Error(`${route} is not a valid function`);
    }

    const requestOptions = apiFunc(args);

    try {
        const response = await fetch(`http://${host}:3001/api/${route}`, requestOptions);
        const data = await response.json();
        //console.log(`Response to ${route}: ${JSON.stringify(data)}`)
        return data; // Return the data from the API call
    } catch (error) {
        throw error; // Throw any errors that occur during the API call
    }
}