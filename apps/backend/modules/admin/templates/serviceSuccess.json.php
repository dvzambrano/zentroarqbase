[
<?php
$nb = count($events);
$i = 0;
foreach ($events as $event):++$i
    ?>
    {
    "url": "<?php echo $host . $event->getId() ?>",
    <?php
    $nb1 = count($event);
    $j = 0;
    foreach ($event as $key => $value):++$j
        ?>
        "<?php echo $key ?>": <?php
        echo json_encode($value) . ($nb1 == $j ? '' :
                ',')
        ?>
    <?php endforeach ?>
    }<?php echo $nb == $i ? '' : ',' ?>
<?php endforeach ?>
]