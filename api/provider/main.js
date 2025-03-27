const modules = {
    firestore: require('./firebase/firestore'),
    auth: require('./firebase/auth'),
    queries: require('./supabase/queries')
}

for(const module of Object.values(modules)){
    Object.keys(module).forEach(key => {
        if (key !== 'default' && key !== '__esModule') {
            exports[key] = module[key];
        }
    });
}
