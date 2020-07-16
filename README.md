# binaize-ui

## To deploy in EC2 DEV cluster

```bash
ssh -i "binaize-optimize.pem" ubuntu@dev.app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout development
cp theia-dev.env theia.env
cp nginx-dev.env nginx.env
```

## To deploy in EC2 STAGING cluster

```bash
ssh -i "binaize-optimize.pem" ubuntu@staging.app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout staging
cp theia-staging.env theia.env
cp nginx-staging.env nginx.env
```

## To deploy in EC2 PROD cluster

```bash
ssh -i "binaize-optimize.pem" ubuntu@app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout master
cp theia-prod.env theia.env
cp nginx-prod.env nginx.env
```

# For deployment

```bash
nohup sudo docker-compose -f docker-compose-theia.yaml up --build --remove-orphans >> ~/theia.out&
```
