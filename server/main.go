package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/AngelVlc/todos_backend/src/pkg/autocerts3cache"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	for _, item := range os.Environ() {
		log.Println(item)
	}

	router := newRouter()

	ctx := context.Background()

	httpServer := &http.Server{
		Addr:         fmt.Sprintf(":%v", os.Getenv("PORT")),
		Handler:      router,
		WriteTimeout: 5 * time.Second,
		ReadTimeout:  5 * time.Second,
		IdleTimeout:  120 * time.Second,
		BaseContext:  func(_ net.Listener) context.Context { return ctx },
	}

	var certManager *autocert.Manager

	awsCfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("error loading the default config: %v", err)
	}

	awsS3Api := autocerts3cache.NewAwsS3Api(awsCfg)
	s3Cache := autocerts3cache.NewS3Cache(os.Getenv("BUCKET_NAME"), awsS3Api)

	certManager = &autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist(os.Getenv("DOMAIN")),
		Cache:      s3Cache,
	}

	tlsConfig := &tls.Config{
		GetCertificate: certManager.GetCertificate,
	}
	tlsConfig.NextProtos = append([]string{"h2", "http/1.1", "acme-tls/1"}, tlsConfig.NextProtos...)

	httpServer.TLSConfig = tlsConfig
	httpServer.Addr = ":443"

	go func() {
		log.Printf("Starting listener on port :80\n")
		err = http.ListenAndServe(":80", http.HandlerFunc(redirect))
		if err != nil {
			log.Fatalf("could not listen on port :80 %v", err)
		}
	}()

	log.Printf("Starting listener on port %v\n", httpServer.Addr)
	err = httpServer.ListenAndServeTLS("", "")
	if err != nil {
		log.Fatalf("could not listen on port %v %v", httpServer.Addr, err)
	}
}

func newRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	router.
		PathPrefix("/").
		Handler(http.FileServer(http.Dir("../build")))

	return router
}

func redirect(w http.ResponseWriter, req *http.Request) {
	// remove/add not default ports from req.Host
	target := "https://" + req.Host + req.URL.Path
	if len(req.URL.RawQuery) > 0 {
		target += "?" + req.URL.RawQuery
	}
	http.Redirect(w, req, target, http.StatusTemporaryRedirect)
}
