
for filename in base_gcmessages gcsdk_gcmessages dota_gcmessages_client dota_gcmessages_common 
do
    protoc --descriptor_set_out=$filename.desc --include_imports $filename.proto 
done
