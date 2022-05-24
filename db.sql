DROP DATABASE IF EXISTS a6;
CREATE DATABASE a6;
USE a6;

DROP TABLE IF EXISTS phrase;

CREATE TABLE phrase(
    id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
    regDate DATETIME NOT NULL DEFAULT NOW(),
    content TEXT NOT NULL, 
    author VARCHAR(100) NOT NULL DEFAULT '작가미상'
);

INSERT INTO phrase
SET content = '삶이 있는 한 희망은 있다',
author = '키케로';

INSERT INTO phrase
SET content = '산다는 것 그것은 치열한 전투이다.',
author = '로망 로랑';

INSERT INTO phrase
SET content = '하루에 3시간을 걸으면 7년 후에 지구를 한 바퀴 돌 수 있다.',
author = '사무엘 존슨';

INSERT INTO phrase
SET content = '언제나 현재에 집중할 수 있다면 행복할 것이다.',
author = '파울로 코엘료';

INSERT INTO phrase
SET content = '신은 용기 있는 자를 결코 버리지 않는다.',
author = '켄러';

SELECT * FROM phrase;