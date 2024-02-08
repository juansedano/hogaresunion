<?php
    # Includes the autoloader for libraries installed with composer
    require __DIR__ . '/.././vendor/autoload.php';

    # Imports the Google Cloud client library
    use Google\Cloud\Storage\StorageClient;
    use GuzzleHttp\Psr7\Response;

    putenv("GOOGLE_APPLICATION_CREDENTIALS=../bat/bucketKey.json");
    
    # Your Google Cloud Platform project ID
    $projectId = 'tratodirecto-1493419433815';


    /**
     * Upload a file.
     *
     * example: 
     * ```
     * upload_object('tratodirecto.com', $_POST['nameImage'], $_FILES['myfile']['tmp_name']);
     * ```
     * 
     * @param string $bucketName the name of your Google Cloud bucket.
     * @param string $objectName the name of the object.
     * @param string $source the path to the file to upload.
     * @param boolean $makePublic optional 
     *  
     * @return boolean 
     *
     */
    function upload_object($bucketName, $objectName, $source, $makePublic = false) {
        $storage = new StorageClient();
        $file = fopen($source, 'r');
        $bucket = $storage->bucket($bucketName);
        $object = $bucket->upload($file, [
            'name' => $objectName,
            'public' => true,
            'resumable' => false,
            'validation' => false,
            'metadata' => ['Cache-control' => 'public, max-age=31536000']
        ]);

        if ($object != null) {
            if ($makePublic) {
                $object->update(['acl' => []], ['predefinedAcl' => 'PUBLICREAD']);
            }
            return true;
        }
        return false;
    }

    /**
     * List all Cloud Storage buckets for the current project.
     *
     * example:
     * ```
     * list_buckets();
     * ```
     * 
     * @return void
     * 
     */
    function list_buckets(){
        $storage = new StorageClient();
        $buckets = $storage->buckets();
        foreach ($buckets as $bucket ) {
            echo $bucket->name() . PHP_EOL;
        }
    }

    /**
     * List Cloud Storage bucket objects.
     * 
     * Example: 
     * ```
     * list_objects('tratodirecto.com');
     * ```
     *
     * @param string $bucketName the name of your Cloud Storage bucket.
     *
     * @return void
     * 
     */
    //list_objects('tratodirecto.com');
    function list_objects($bucketName){
        $storage = new StorageClient();
        $bucket = $storage->bucket($bucketName);
        foreach ($bucket->objects() as $object) {
            printf('Object: %s' . PHP_EOL, $object->name());
        }
    }

    /**
     * Delete an object.
     * 
     * Example: 
     * ```
     * delete_Object('tratodirecto.com', 'testcloud-gerard.png');
     * ```
     *
     * @param string $bucketName the name of your Cloud Storage bucket.
     * @param string $objectName the name of your Cloud Storage object.
     *
     * @return void
     * 
     */
    function delete_Object($bucketName, $objectName){
        $storage = new StorageClient();
        $bucket = $storage->bucket($bucketName);
        $object = $bucket->object($objectName);
        $object->delete();
    }

    /**
     * ```
     * Not work :p
     * ```
     * Download an object from Cloud Storage and save it as a local file.
     * 
     * Example:
     * ```
     * downloadObject('tratodirecto.com', 'testcloud-gerard2.png', '');
     * ```
     *
     * @param string $bucketName the name of your Google Cloud bucket.
     * @param string $objectName the name of your Google Cloud object.
     * @param string $destination the local destination to save the encrypted object.
     *
     * @return void
     * 
     */
    function downloadObject($bucketName, $objectName, $destination){
        $storage = new StorageClient();
        $bucket = $storage->bucket($bucketName);
        $object = $bucket->object($objectName);
        $object->downloadToFile( __DIR__.'/'.$objectName );
    }
?>