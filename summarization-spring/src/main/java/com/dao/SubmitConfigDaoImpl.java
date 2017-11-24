package com.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.model.SubmitConfig;

@Repository
public class SubmitConfigDaoImpl implements SubmitConfigDao {
	
	@Autowired
	MongoTemplate mongoTemplate;
	
	private static final String COLLECTION_NAME = "submitConfig";

	public List<SubmitConfig> listSubmitConfig() {
		return mongoTemplate.findAll(SubmitConfig.class, COLLECTION_NAME);
	}

	public void add(SubmitConfig submitConfig) {
		if(!mongoTemplate.collectionExists(SubmitConfig.class)) {
			mongoTemplate.createCollection(SubmitConfig.class);
		}
		submitConfig.setId(UUID.randomUUID().toString());
		mongoTemplate.insert(submitConfig, COLLECTION_NAME);
	}
	
	public void delete(SubmitConfig submitConfig) {
		mongoTemplate.remove(submitConfig, COLLECTION_NAME);
	}

	public SubmitConfig findSubmitConfigById(String id) {
		return mongoTemplate.findById(id, SubmitConfig.class);
	}

	public void update(SubmitConfig submitConfig) {
		mongoTemplate.save(submitConfig,COLLECTION_NAME);
		
	}

}

