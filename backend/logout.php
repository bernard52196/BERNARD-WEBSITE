<?php
// ============================================
// Logout API
// POST /backend/logout.php
// ============================================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['error' => 'No token provided']);
    exit;
}

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("DELETE FROM sessions WHERE token = ?");
    $stmt->execute([$token]);
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Logout failed']);
}
?>