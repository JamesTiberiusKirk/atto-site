package cron

import (
	"log"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Query().Get("key") == "hardcodedKey2231" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	log.Print("Go function invocation")
	w.WriteHeader(http.StatusOK)
}
