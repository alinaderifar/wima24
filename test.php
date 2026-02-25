<?php
// fix-storage-link.php
$target = $_SERVER['DOCUMENT_ROOT'] . '/storage/app/public';
$link = $_SERVER['DOCUMENT_ROOT'] . '/public/storage';



// ساخت لینک جدید
if (symlink($target, $link)) {
    echo "Storage linked successfully!<br>";
    echo "Target: $target<br>";
    echo "Link: $link";
} else {
    echo "Failed to create symlink!";
}
