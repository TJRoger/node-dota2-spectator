TMP_FOLDER="./generated"
DOTA_PROTOS_PATH="./"

for FILENAME in base_gcmessages gcsdk_gcmessages dota_gcmessages_client dota_gcmessages_common
do
    protoc --descriptor_set_out=$FILENAME.desc --include_imports --proto_path=$DOTA_PROTOS_PATH/$FILENAME.proto syntax = "protoc 2.0"
done

echo "DONE!"

