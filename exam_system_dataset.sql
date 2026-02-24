-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: exam_system_db
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer_selected_options`
--

DROP TABLE IF EXISTS `answer_selected_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer_selected_options` (
  `answer_id` bigint NOT NULL,
  `option_id` bigint NOT NULL,
  KEY `FKckpx00kgkp43oymmto7rr6ctl` (`option_id`),
  KEY `FKs8w09pgjkakjj35mb8jfifhv3` (`answer_id`),
  CONSTRAINT `FKckpx00kgkp43oymmto7rr6ctl` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`),
  CONSTRAINT `FKs8w09pgjkakjj35mb8jfifhv3` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer_selected_options`
--

LOCK TABLES `answer_selected_options` WRITE;
/*!40000 ALTER TABLE `answer_selected_options` DISABLE KEYS */;
INSERT INTO `answer_selected_options` VALUES (18,140),(19,142),(20,144),(18,39),(19,41),(20,43),(21,45),(22,49),(23,57),(24,61),(25,65),(26,69);
/*!40000 ALTER TABLE `answer_selected_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_correct` bit(1) DEFAULT NULL,
  `marks_obtained` int DEFAULT NULL,
  `exam_attempt_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgxrkjl0rlw2640nnk5gkny8xa` (`exam_attempt_id`),
  KEY `FK3erw1a3t0r78st8ty27x6v3g1` (`question_id`),
  CONSTRAINT `FK3erw1a3t0r78st8ty27x6v3g1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `FKgxrkjl0rlw2640nnk5gkny8xa` FOREIGN KEY (`exam_attempt_id`) REFERENCES `exam_attempts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (18,_binary '',10,19,20),(19,_binary '',102,20,21),(20,_binary '',3,21,22),(21,_binary '',2,22,23),(22,_binary '',10,23,24),(23,_binary '',2,24,26),(24,_binary '',10,25,27),(25,_binary '',2,26,28),(26,_binary '',10,27,29);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_attempts`
--

DROP TABLE IF EXISTS `exam_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expires_at` datetime(6) NOT NULL,
  `passed` bit(1) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `started_at` datetime(6) NOT NULL,
  `status` enum('IN_PROGRESS','SUBMITTED','EXPIRED','EVALUATED') NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `total_marks` int DEFAULT NULL,
  `exam_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `tab_switch_count` int DEFAULT '0',
  `fullscreen_violations` int DEFAULT '0',
  `camera_off_violations` int DEFAULT '0',
  `auto_submitted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK5tomiinihc09ywy0wh15pi2cs` (`exam_id`),
  KEY `FKg2vsf7tmpfsrdprupd8gecl6x` (`student_id`),
  CONSTRAINT `FK5tomiinihc09ywy0wh15pi2cs` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`),
  CONSTRAINT `FKg2vsf7tmpfsrdprupd8gecl6x` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_attempts`
--

LOCK TABLES `exam_attempts` WRITE;
/*!40000 ALTER TABLE `exam_attempts` DISABLE KEYS */;
INSERT INTO `exam_attempts` VALUES (19,'2026-02-13 08:45:08.508980',_binary '',10,'2026-02-13 08:44:08.517402','EVALUATED','2026-02-13 08:44:16.411779',10,20,2,0,0,0,0),(20,'2026-02-13 08:57:04.390293',_binary '',100,'2026-02-13 08:56:04.399798','EVALUATED','2026-02-13 08:56:11.341387',100,21,2,0,0,0,0),(21,'2026-02-13 08:59:41.390736',_binary '\0',3,'2026-02-13 08:57:41.399256','EVALUATED','2026-02-13 08:57:48.266691',100,22,2,0,0,0,0),(22,'2026-02-14 23:30:56.576892',_binary '\0',2,'2026-02-14 23:28:56.586415','EVALUATED','2026-02-14 23:29:02.475910',10,23,2,0,0,0,0),(23,'2026-02-14 23:37:02.279181',_binary '',10,'2026-02-14 23:32:02.280186','EVALUATED','2026-02-14 23:32:07.153364',10,24,2,0,0,0,0),(24,'2026-02-15 00:56:35.601124',_binary '\0',2,'2026-02-14 23:56:35.613225','EVALUATED','2026-02-14 23:56:39.284416',100,26,2,0,0,0,0),(25,'2026-02-15 00:21:41.338557',_binary '',10,'2026-02-15 00:16:41.347543','EVALUATED','2026-02-15 00:16:48.537040',10,27,2,0,0,0,0),(26,'2026-02-15 01:17:50.586878',_binary '\0',2,'2026-02-15 00:17:50.586878','EVALUATED','2026-02-15 00:17:54.326791',100,28,2,0,0,0,0),(27,'2026-02-15 00:49:40.823369',_binary '',10,'2026-02-15 00:43:40.838366','EVALUATED','2026-02-15 00:43:44.824373',10,29,2,0,0,0,0);
/*!40000 ALTER TABLE `exam_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `duration_minutes` int NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `passing_marks` int NOT NULL,
  `show_result_immediately` bit(1) NOT NULL,
  `shuffle_questions` bit(1) NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `total_marks` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (20,'2026-02-13 08:43:24.991169','k.njb',1,'2026-02-13 03:15:00.000000',_binary '',10,_binary '',_binary '\0','2026-02-13 03:13:00.000000','sCv',10,'2026-02-13 08:43:24.991169'),(21,'2026-02-13 08:55:48.276368','adfh',1,'2026-02-13 03:27:00.000000',_binary '',100,_binary '',_binary '\0','2026-02-13 03:25:00.000000','ddg',100,'2026-02-13 08:55:48.276368'),(22,'2026-02-13 08:57:21.424712','safdvbfnm',2,'2026-02-13 03:29:00.000000',_binary '',97,_binary '\0',_binary '\0','2026-02-13 03:27:00.000000','sfdbfn',100,'2026-02-13 08:57:21.424712'),(23,'2026-02-14 23:28:29.135518','kj,',2,'2026-02-14 18:00:00.000000',_binary '',10,_binary '',_binary '\0','2026-02-14 17:58:00.000000','Gate',10,'2026-02-14 23:28:29.135518'),(24,'2026-02-14 23:31:35.709841','hgm,',5,'2026-02-14 18:10:00.000000',_binary '',10,_binary '',_binary '\0','2026-02-14 18:00:00.000000','satr',10,'2026-02-14 23:31:35.709841'),(25,'2026-02-14 23:54:47.421349','fjm',2,'2026-02-13 18:34:00.000000',_binary '',10,_binary '',_binary '\0','2026-02-14 18:24:00.000000','gategnfmh',10,'2026-02-14 23:54:47.421349'),(26,'2026-02-14 23:56:14.779414','fn ',60,'2026-02-14 19:25:00.000000',_binary '',100,_binary '',_binary '\0','2026-02-14 18:25:00.000000','vfbnm',100,'2026-02-14 23:56:14.779414'),(27,'2026-02-15 00:16:20.114604','This is Gate exam',5,'2026-02-14 18:56:00.000000',_binary '',10,_binary '',_binary '\0','2026-02-14 18:46:00.000000','APS',10,'2026-02-15 00:16:20.114604'),(28,'2026-02-15 00:17:31.550817','dsf',60,'2026-02-14 19:47:00.000000',_binary '',100,_binary '',_binary '\0','2026-02-14 18:47:00.000000','aps1',100,'2026-02-15 00:17:31.553337'),(29,'2026-02-15 00:43:18.066663','',6,'2026-02-14 19:42:00.000000',_binary '',10,_binary '',_binary '\0','2026-02-14 19:12:00.000000','APD12',10,'2026-02-15 00:43:18.066663');
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_correct` bit(1) NOT NULL,
  `option_text` text NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5bmv46so2y5igt9o9n9w4fh6y` (`question_id`),
  CONSTRAINT `FK5bmv46so2y5igt9o9n9w4fh6y` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (39,_binary '','1',20),(40,_binary '\0','2',20),(41,_binary '','vcb',21),(42,_binary '\0','sdb',21),(43,_binary '','ccxb',22),(44,_binary '\0','sdgh',22),(45,_binary '','Programming Language',23),(46,_binary '\0','OS',23),(47,_binary '\0','Browser',23),(48,_binary '\0','Database',23),(49,_binary '','Pragramming Language',24),(50,_binary '\0','OS',24),(51,_binary '\0','Browser',24),(52,_binary '\0','Database',24),(53,_binary '','Language',25),(54,_binary '\0','OS',25),(55,_binary '\0','Browser',25),(56,_binary '\0','Database',25),(57,_binary '','Language',26),(58,_binary '\0','OS',26),(59,_binary '\0','Browser',26),(60,_binary '\0','Database',26),(61,_binary '','Language',27),(62,_binary '\0','OS',27),(63,_binary '\0','Browser',27),(64,_binary '\0','Database',27),(65,_binary '','Language',28),(66,_binary '\0','OS',28),(67,_binary '\0','Browser',28),(68,_binary '\0','Database',28),(69,_binary '','Language',29),(70,_binary '\0','OS',29),(71,_binary '\0','Browser',29),(72,_binary '\0','Database',29);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `marks` int NOT NULL,
  `order_number` int NOT NULL,
  `question_text` text NOT NULL,
  `type` enum('SINGLE_CHOICE','MULTIPLE_CHOICE') NOT NULL,
  `exam_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrk78bmt53fns7np8casqa3q44` (`exam_id`),
  CONSTRAINT `FKrk78bmt53fns7np8casqa3q44` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (20,10,1,'/lnb','SINGLE_CHOICE',20),(21,102,1,'Db','SINGLE_CHOICE',21),(22,3,1,'xCvb','SINGLE_CHOICE',22),(23,2,1,'What is Java?','SINGLE_CHOICE',23),(24,10,1,'What is Java?','SINGLE_CHOICE',24),(25,2,1,'What is Java?','SINGLE_CHOICE',25),(26,2,1,'What is Java?','SINGLE_CHOICE',26),(27,10,1,'What is Java?','SINGLE_CHOICE',27),(28,2,1,'What is Java?','SINGLE_CHOICE',28),(29,10,1,'What is Java?','SINGLE_CHOICE',29);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','STUDENT') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-02-12 10:03:05.900033','shubham@test.com',_binary '','Shubham Sengar','$2a$10$VG1w4FHd2TEWuQaSlVExaOHqU5opYGNaPGTsCarMBRInIReSZi4vO','ADMIN','2026-02-12 10:03:05.900033','shubham'),(2,'2026-02-12 10:04:39.500320','shubhanshi@test.com',_binary '','Shubhanshi Dwivedi','$2a$10$KmW9Kcdaijx94Q0dBYXvgeD2wWCMENgBfsLL/W/guFJoX8AwaRqW2','STUDENT','2026-02-12 10:04:39.500320','shubhanshi'),(3,'2026-02-12 22:17:04.116098','vandu@test.com',_binary '','Vandana','$2a$10$e611fx/1TcI4qRd09GV0/ucqrKlFTD9jjPAZzo/xyP0yLFQnzDsoS','ADMIN','2026-02-12 22:17:04.116098','vandana'),(4,'2026-02-13 07:07:03.766400','student1@test.com',_binary '','student1','$2a$10$/HDYGQWWiciZ.SXDhkeDAe68XHWV.NySpC0Hmjvt9n.9YcGxAZiUi','STUDENT','2026-02-13 07:07:03.766400','student1'),(5,'2026-02-13 08:36:46.309162','aarav@test.com',_binary '','aarav','$2a$10$jquPqVHDSehiRbFbtTgTpOaQ76y8HhHR89OOdkORl/EbN6v3b0fRK','STUDENT','2026-02-13 08:36:46.309162','aarav'),(6,'2026-02-13 08:37:27.460888','aarav2@test.com',_binary '','aarav2','$2a$10$QrGnXZJi8oddX77s1t8nKOjLuCFBc.zogjAOxuI15ijPW4eMqHPEC','STUDENT','2026-02-13 08:37:27.460888','aarav2'),(7,'2026-02-13 08:37:55.454565','aarav3@test.com',_binary '','aarav3','$2a$10$fZYZeDyxXan0MSnzzU/yiODLvazg/VreFxft8HlyuzBkwYcU/Klu.','ADMIN','2026-02-13 08:37:55.454565','aarav3');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-24 21:16:43
