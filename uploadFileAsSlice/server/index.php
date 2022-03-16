<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Access-Control-Allow-Origin:*");


// 返回并相应数据
function show_json($status = 1, $return = NULL)
{

  $ret = array('status' => $status, 'result' => array());
  if (!is_array($return)) {
    if ($return) {
      $ret['result']['message'] = $return;
    }
    exit(json_encode($ret));
  } else {
    $ret['result'] = $return;
  }
  exit(json_encode($ret));
}

// 预检请求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit; // finish preflight CORS requests here
}

if (!empty($_REQUEST['debug'])) {
  $random = rand(0, intval($_REQUEST['debug']));
  if ($random === 0) {
    header("HTTP/1.0 500 Internal Server Error");
    exit;
  }
}

@set_time_limit(0);

$targetDir = 'uploads/file_material_tmp';
$uploadDir = 'uploads/file_material/' . date('Ymd');

$cleanupTargetDir = true; // Remove old files
$maxFileAge = 5 * 3600; // Temp file age in seconds
$mode = 0777; // 0777 权限

// Create target dir
if (!file_exists($targetDir)) {
  @mkdir($targetDir, $mode, true);
  @chmod($targetDir, $mode);
}
// Create uploadt dir
if (!file_exists($uploadDir)) {
  @mkdir($uploadDir, $mode, true);
  @chmod($uploadDir, $mode);
}
// Get a file name
if (isset($_REQUEST["name"])) {
  $fileName = $_REQUEST["name"];
} elseif (!empty($_FILES)) {
  $fileName = $_FILES["file"]["name"];
} else {
  $fileName = uniqid("file_");
}
$oldName = $fileName;
$filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;
// $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;
// Chunking might be enabled
$chunk_index = isset($_REQUEST["index"]) ? intval($_REQUEST["index"]) : 0;
$chunk_count = isset($_REQUEST["count"]) ? intval($_REQUEST["count"]) : 1;

// Remove old temp files
if ($cleanupTargetDir) {
  if (!is_dir($targetDir) || !$dir = opendir($targetDir)) {
    show_json(100, 'Failed to open temp directory.');
  }
  while (($file = readdir($dir)) !== false) {
    $tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;
    // If temp file is current file proceed to the next
    if ($tmpfilePath == "{$filePath}_{$chunk_index}.part" || $tmpfilePath == "{$filePath}_{$chunk_index}.parttmp") {
      continue;
    }
    // Remove temp file if it is older than the max age and is not the current file
    if (preg_match('/\.(part|parttmp)$/', $file) && (@filemtime($tmpfilePath) < time() - $maxFileAge)) {
      @unlink($tmpfilePath);
    }
  }
  closedir($dir);
}


// Open temp file
if (!$out = @fopen("{$filePath}_{$chunk_index}.parttmp", "wb")) {
  show_json(102, 'Failed to open output stream.');
}

if (!empty($_FILES)) {
  if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
    show_json(103, 'Failed to move uploaded file.');
  }
  // Read binary input stream and append it to temp file
  if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
    show_json(101, 'Failed to open input stream.');
  }
} else {
  if (!$in = @fopen("php://input", "rb")) {
    show_json(101, 'Failed to open input stream.');
  }
}




while ($buff = fread($in, 4096)) {
  fwrite($out, $buff);
}
@fclose($out);
@fclose($in);
rename("{$filePath}_{$chunk_index}.parttmp", "{$filePath}_{$chunk_index}.part");
$index = 0;
$done = true;
for ($index = 0; $index < $chunk_count; $index++) {
  if (!file_exists("{$filePath}_{$index}.part")) {
    $done = false;
    break;
  }
}

if ($done) {
  $pathInfo = pathinfo($fileName);
  $hashStr = substr(md5($pathInfo['basename']), 8, 16);
  $hashName = time() . $hashStr . '.' . $pathInfo['extension'];
  $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $hashName;

  if (!$out = @fopen($uploadPath, "wb")) {
    show_json(102, 'Failed to open output stream. done');
  }
  if (flock($out, LOCK_EX)) {
    for ($index = 0; $index < $chunk_count; $index++) {
      if (!$in = @fopen("{$filePath}_{$index}.part", "rb")) {
        break;
      }
      while ($buff = fread($in, 4096)) {
        fwrite($out, $buff);
      }
      @fclose($in);
      @unlink("{$filePath}_{$index}.part");
    }
    flock($out, LOCK_UN);
  }
  @fclose($out);
  $response = [
    'success' => true,
    'oldName' => $oldName,
    'filePaht' => $uploadPath,
    'fileSuffixes' => $pathInfo['extension'],
    'hashName' => $hashName
  ];

  // 当status返回1时，为上传成功，其他则失败
  show_json(1, array('message' => '上传成功',  'info' => $response));
}
