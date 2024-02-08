<?php
date_default_timezone_set('America/Mexico_City');

function saveLeadForm($leads, $logFile) : void {
    foreach ($leads as $lead) {
        file_put_contents($logFile, "\n".json_encode($lead), FILE_APPEND);
        if ($lead["field"] == "leadgen") {
            $leadId = $lead["value"]["leadgen_id"];
            $token = "EAAF9lek8xywBO15vGno8UdCkLLLZCAN4pblTXZAxAGsdLD24RSjgiQ4atEmqA2KWTx1AZATsJJCjGhKCypBm9muEplJQv8XlUnyjjthgtx5oyxCpIHstZAXIut0x53yOP8vm2vhvZAziW1ybPgDGxcnRfv1gFK3d2bmGbGZASgJsdVrVL78ZCt0XlEToSLkQsEuAGQjG9wZD";

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v18.0/$leadId/");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

            curl_setopt($ch, CURLOPT_POSTFIELDS, "access_token=$token");

            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/x-www-form-urlencoded',
            ]);

            $result = curl_exec($ch);
            if (curl_errno($ch)) error_log('Error:' . curl_error($ch));
            curl_close($ch);

            if (!$result) return;

            file_put_contents($logFile, "\n".json_encode($result), FILE_APPEND);



        }
    }
}

?>