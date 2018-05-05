-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: grabARent
-- ------------------------------------------------------
-- Server version	5.7.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `properties` (
  `idproperties` int(11) NOT NULL AUTO_INCREMENT,
  `neighbourhood` varchar(45) NOT NULL,
  `gps_lat` decimal(10,5) NOT NULL,
  `gps_long` decimal(10,5) NOT NULL,
  `floor` int(11) NOT NULL,
  `maxfloor` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `rooms` int(11) NOT NULL,
  `comfort` varchar(45) NOT NULL,
  `address` varchar(100) NOT NULL,
  `idusers` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  PRIMARY KEY (`idproperties`),
  UNIQUE KEY `idproperties_UNIQUE` (`idproperties`),
  KEY `idusers_idx` (`idusers`),
  CONSTRAINT `idusers` FOREIGN KEY (`idusers`) REFERENCES `users` (`idusers`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'Politehnica',80.34500,80.12300,3,10,350,2,'Decomandat','[object Object]','cd4388c0c62e65ac8b99e3ec49fd9409','Bucuresti'),(2,'Politehnica',80.34500,80.12300,3,10,400,2,'Decomandat','{\"street\":\"Iuliu Maniu\",\"number\":10,\"building\":\"K4\"}','cd4388c0c62e65ac8b99e3ec49fd9409','Bucuresti'),(3,'Lujerului',80.33400,80.44500,2,7,330,2,'Semicomandat','{\"street\":\"Iuliu Maniu\",\"number\":5,\"building\":\"M12\"}','cd4388c0c62e65ac8b99e3ec49fd9409','Bucuresti');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-05 21:16:17
